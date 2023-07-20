import geohash from "ngeohash";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { getGooglePlaces, saveImage } from "../api/google/google";
import { distanceTo } from "geolocation-utils";
import { convertDistance } from "geolib";
import { getUserLocation } from "../utils/geolocation";
import { Geopoint, geohashQueryBounds, distanceBetween } from "geofire-common";

export const saveFilters = async (room, filters, uid) => {
  try {
    const userDoc = firestore().doc(`filters/${uid}`);

    await userDoc.update({
      [room ? "room" : "swipe"]: filters,
    });
  } catch (error) {
    // Handle the error
    console.error("Error saving filters:", error);
    throw error;
  }
};

export const storePlacesRoomData = async (roomCode, data) => {
  try {
    const doc = firestore().collection("rooms").doc(roomCode);
    await doc.update({
      restaurants: data,
    });
  } catch (error) {
    // Handle the error
    console.error("Error storing Google Places data:", error);
    throw error;
  }
};

export const leaveRoomFirestore = async (roomCode, userId) => {
  try {
    const roomRef = firestore().collection("rooms").doc(roomCode);
    const roomDoc = await roomRef.get();
    const roomData = roomDoc.data();
    if (roomData) {
      const updatedMembers = roomData.members.filter(
        (member) => member !== userId
      );

      if (roomData.owner === userId) {
        // If the current user is the owner, delete the room document
        await roomRef.delete();
      } else {
        await roomRef.update({ members: updatedMembers });
      }
      return true;
    }
    return false;
  } catch (error) {
    // Handle the error
    console.error("Error leaving room:", error);
    throw error;
  }
};

export const uploadRestaurantToFirestore = async (
  restaurant,
  filters,
  newDoc = false
) => {
  try {
    const coordinates = restaurant.geometry.location;
    const lat = coordinates.lat;
    const lon = coordinates.lng;

    const hash = geohash.encode(lat, lon);
    const updatedTimestamp = serverTimestamp();

    const filtersTrue = Object.keys(filters).filter(
      (key) => filters[key] === true
    );

    let filter = filtersTrue.length === 1 ? filtersTrue : null;
    if (filter)
      filter = filter.filter((filter) => !restaurant?.types?.includes(filter));

    const newRestaurant = {
      ...restaurant,
      geohash: hash,
      updated: updatedTimestamp,
      photos: [],
      types: filter
        ? [...restaurant?.types, ...filter]
        : [...restaurant?.types],
    };

    const docRef = firestore().collection("places").doc(restaurant.place_id);
    if (restaurant?.photos)
      if (restaurant.photos[0].photo_reference) {
        for (const photo of restaurant.photos) {
          const byteImage = await saveImage(
            photo.photo_reference,
            restaurant.place_id
          );

          // Update newRestaurant.photos with the Firestore storage URL
          newRestaurant.photos.push({
            photoUrl: byteImage,
          });
        }
      } else {
        newRestaurant.photos = restaurant.photos;
      }

    newDoc
      ? await docRef.set(newRestaurant)
      : await docRef.update(newRestaurant);

    return { success: true, error: null, data: newRestaurant };
  } catch (error) {
    return { success: false, error: error.message, data: null };
  }
};

export const checkDocumentExists = async (placeId) => {
  try {
    const docRef = firestore().doc(`places/${placeId}`);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return { exists: true, data: docSnap.data() };
    } else {
      return { exists: false, data: null };
    }
  } catch (error) {
    return { exists: false, data: null, error: error.message };
  }
};

export const fetchUserProfile = async (user) => {
  try {
    const usersDoc = firestore().doc(`users/${user.uid}`);
    const result = await usersDoc.get();
    return result.data();
  } catch (error) {
    // Handle the error
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const fetchNearbyPlaces = async (distance, filters, pageToken) => {
  try {
    let results;
    const userLocation = await getUserLocation();
    results = await fetchNearbyPlacesFromFirestore(
      userLocation,
      distance,
      filters,
      pageToken
    );

    // Check if firestore result is too small.
    if (results?.results?.length < 20) {
      // Fetch Restuarants from Google Places API.
      results = await getGooglePlaces(userLocation, pageToken, filters);
      results.results = filterOutDuplicates(results.results);
      // Check if places are in firestore, if not upload them to firestore.
      results.results = await Promise.all(
        results.results.map(async (restaurant) => {
          // Check if restaurant exists in firestore.
          const restaurantFromFirestore = await checkDocumentExists(
            restaurant.place_id
          );

          // If google restaurant exists in firestore then use firestore data.
          if (restaurantFromFirestore.exists) {
            return restaurantFromFirestore.data;
          }

          // If google restaurant doesn't exist, upload it to firestore.
          if (!restaurantFromFirestore.exists) {
            const { data } = await uploadRestaurantToFirestore(
              restaurant,
              filters,
              true
            );
            return data;
          }
        })
      );
    }

    return {
      results: results?.results,
      nextPageToken: results.nextPageToken,
      error: null,
    };
  } catch (error) {
    return { results: null, nextPageToken: null, error: error.message };
  }
};
export const fetchNearbyPlacesFromFirestore = async (
  location,
  distance, // In Miles
  filters,
  pageToken
) => {
  try {
    const filterKeys = Object.keys(filters).filter(
      (key) => filters[key] && key
    );

    const center = [location.latitude, location.longitude] as Geopoint;
    const radiusInM = distance * 1609.344;
    const bounds = geohashQueryBounds(center, radiusInM);
    const promises = [];
    const placesRef = firestore().collection("places");

    for (const b of bounds) {
      let q = placesRef
        .orderBy("geohash")
        .startAfter(pageToken)
        .startAt(b[0])
        .endAt(b[1])
        .where("types", "array-contains-any", filterKeys)
        .limit(60);

      promises.push(q.get());
    }

    const snapshots = await Promise.all(promises);

    const matchingDocs = [];
    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const location = doc.data().geometry.location;
        // We have to filter out a few false positives due to GeoHash
        // accuracy, but most will match
        const distanceInKm = distanceBetween(
          [location.lat, location.lng],
          center
        );
        const distanceInM = distanceInKm * 1000;
        const distanceInMiles = Math.ceil(distanceInM / 1609.344);
        if (distanceInM <= radiusInM) {
          matchingDocs.push({ ...doc.data(), distance: distanceInMiles });
        }
      }
    }

    matchingDocs.sort((a, b) => b.distance - a.distance);

    let nextPageToken = snapshots[0].docs[snapshots[0].docs.length - 1];
    if (matchingDocs.length < 60) nextPageToken = null;
    let error;
    if (matchingDocs.length === 0) error = true;

    return {
      results: filterOutDuplicates(matchingDocs),
      nextPageToken: nextPageToken,
      error: error,
    };
  } catch (error) {
    // Handle the error
    return { results: [], nextPageToken: null, error: error };
  }
};
const filterOutDuplicates = (restaurants) => {
  const uniqueRestaurants = [];
  const restaurantIds = new Set();

  // Loop through the restaurants and filter out duplicates based on the place_id
  for (const restaurant of restaurants) {
    if (!restaurantIds.has(restaurant.place_id)) {
      uniqueRestaurants.push(restaurant);
      restaurantIds.add(restaurant.place_id);
    }
  }

  return uniqueRestaurants;
};
export const addFiltersToTypes = (types, filters) => {
  const existingTypes = types || []; // Get existing types or initialize as an empty array
  const newTypes = [
    ...existingTypes,
    ...Object.keys(filters).filter(
      (filter) =>
        filters[filter] !== undefined &&
        filters[filter] === true && // Filter out undefined values
        !existingTypes.includes(filter)
    ),
  ];

  return Array.from(new Set(newTypes));
};

export const addRestaurantToMatchedListInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = firestore().collection("users").doc(userId);

    // Get the user's current matched restaurants array
    const userDoc = await userRef.get();
    const matchedRestaurants = userDoc.data().matchedRestaurants || [];

    // Check if the placeId is already in the matched restaurants array
    if (!matchedRestaurants.includes(placeId)) {
      // Add the new placeId to the matched restaurants array
      const updatedMatchedRestaurants = [...matchedRestaurants, placeId];

      // Update the user document with the updated matched restaurants array
      await userRef.update({
        matchedRestaurants: updatedMatchedRestaurants,
      });
    }
  } catch (error) {
    // Handle the error
    console.error("Error adding restaurant to matched list:", error);
    throw error;
  }
};

export const addRestaurantToFavoritesListInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = firestore().collection("users").doc(userId);

    // Get the user's current favorited restaurants array
    const userDoc = await userRef.get();
    const favoritedRestaurants = userDoc.data().favoritedRestaurants || [];

    // Check if the placeId is already in the favorited restaurants array
    if (!favoritedRestaurants.includes(placeId)) {
      // Add the new placeId to the favorited restaurants array
      const updatedFavoritedRestaurants = [...favoritedRestaurants, placeId];

      // Update the user document with the updated favorited restaurants array
      await userRef.update({
        favoritedRestaurants: updatedFavoritedRestaurants,
      });
    }
  } catch (error) {
    // Handle the error
    console.error("Error adding restaurant to favorites list:", error);
    throw error;
  }
};

export const removeRestaurantFromFavoritesInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = firestore().doc(`users/${userId}`);

    // Get the user's current favorites array
    const userDoc = await userRef.get();
    const favorites = userDoc.data().favoritedRestaurants || [];

    // Remove the placeId from the favorites array
    const updatedFavorites = favorites.filter(
      (restaurantId) => restaurantId !== placeId
    );

    // Update the user document with the updated favorites array
    await userRef.update({ favoritedRestaurants: updatedFavorites });
  } catch (error) {
    // Handle the error
    console.error("Error removing restaurant from favorites:", error);
    throw error;
  }
};

export const removeRestaurantFromMatchedInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = firestore().doc(`users/${userId}`);

    // Get the user's current matched restaurants array
    const userDoc = await userRef.get();
    const matched = userDoc.data().matchedRestaurants || [];

    // Remove the placeId from the matched restaurants array
    const updatedMatchedRestaurants = matched.filter(
      (restaurantId) => restaurantId !== placeId
    );

    // Update the user document with the updated matched restaurants array
    await userRef.update({ matchedRestaurants: updatedMatchedRestaurants });
  } catch (error) {
    // Handle the error
    console.error("Error removing restaurant from matched:", error);
    throw error;
  }
};

export const updateUserProfileInFirestore = async (uid, userProfile) => {
  try {
    const userRef = firestore().doc(`users/${uid}`);
    await userRef.update(userProfile);
  } catch (error) {
    // Handle the error
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const saveProfile = async (imageURI, username, user) => {
  try {
    // Convert data URL to a blob
    const response = await fetch(imageURI);
    const blob = await response.blob();

    // Create a storage reference with a unique filename
    const storageRef = storage().ref(
      `user-profiles/${user.uid}/${Date.now().toString()}`
    );

    // Upload the blob to Firebase Storage (resumable)
    await storageRef.put(blob);

    const imageURL = await storageRef.getDownloadURL();

    // Update the user profile in Firestore
    const userRef = firebase.firestore().collection("users").doc(user.uid);
    let profile: any = {
      displayName: username,
      photoURL: imageURL,
    };

    if (!user?.displayName) {
      profile = {
        ...profile,
        subscriptions: {
          free: Timestamp.now(),
          standard: null,
          premium: null,
        },
        discovers: 5,
        rooms: 5,
      };
    }
    await userRef.update(profile);

    // Update the profile in the authentication system
    await auth().currentUser.updateProfile({
      displayName: username,
      photoURL: imageURL,
    });

    return profile;
  } catch (error) {
    // Handle the error
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const updateProfileInFirestore = async (uid, profileData) => {
  try {
    const userDoc = firestore().doc(`users/${uid}`);
    await userDoc.update(profileData);
  } catch (error) {
    // Handle the error
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const uploadProfileImageToStorage = async (uid, imageURI) => {
  try {
    // Convert data URL to a blob
    const response = await fetch(imageURI);
    const blob = await response.blob();

    // Create a storage reference with a unique filename
    const storageRef = storage().ref(`profile-images/${uid}`);

    // Upload the blob to Firebase Storage (resumable)
    const uploadTask = await storageRef.put(blob);
    const imageURL = await storage()
      .ref(`profile-images/${uid}`)
      .getDownloadURL();
    return imageURL;
  } catch (error) {
    // Handle the error
    console.error("Error uploading profile image:", error);
    throw error;
  }
};

export const fetchProfileImageFromStorage = async (uid) => {
  try {
    const storageRef = storage().ref(`profile-images/${uid}`);

    const imageURL = await storageRef.getDownloadURL();

    return imageURL;
  } catch (error) {
    // Handle the error
    console.error("Error fetching profile image:", error);
    throw error;
  }
};
