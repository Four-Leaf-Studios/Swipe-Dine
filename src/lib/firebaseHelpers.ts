import geohash from "ngeohash";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";
import { query, serverTimestamp } from "firebase/firestore";
import { saveImage } from "../api/google/google";
import { distanceTo } from "geolocation-utils";
import { convertDistance } from "geolib";

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

export const storeGooglePlacesData = async (roomCode, data) => {
  try {
    const doc = firestore().doc(`rooms/${roomCode}`);
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

export const fetchNearbyPlacesFromFirestore = async (
  location,
  distance, // In Miles
  filters,
  pageToken
) => {
  try {
    const range = getGeohashRange(
      location.latitude,
      location.longitude,
      distance
    );

    const filterKeys = Object.keys(filters).filter(
      (key) => filters[key] && key
    );
    const placesRef = firestore().collection("places");
    let q = placesRef
      .where("geohash", ">=", range.lower)
      .where("geohash", "<=", range.upper)
      .where("types", "array-contains-any", filterKeys);

    const querySnapshot = await q.orderBy("geohash").limit(60).get();

    const places = querySnapshot.docs.map((doc) => doc.data());

    // Sort places by distance
    const paddingDistance = 7;
    const sortedPlaces = await Promise.all(
      places.map(async (place) => {
        const distance = await distanceTo(location, place.geometry.location);
        const milesDistance = parseInt(
          convertDistance(distance, "mi").toFixed(2)
        );

        return { ...place, distance: milesDistance + paddingDistance };
      })
    );

    sortedPlaces.sort((a, b) => b.distance - a.distance);

    const nextPageToken = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { results: sortedPlaces, nextPageToken: nextPageToken };
  } catch (error) {
    // Handle the error
    console.error("Error fetching nearby places:", error);
    return { results: [], nextPageToken: null };
  }
};

// Calculate the upper and lower boundary geohashes for
// a given latitude, longitude, and distance in miles
const getGeohashRange = (latitude, longitude, distance) => {
  const lat = 0.01; // degrees latitude per mile
  const lon = 0.01; // degrees longitude per mile

  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;

  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;
  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);

  return {
    lower,
    upper,
  };
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
    await userRef.update({
      displayName: username,
      photoURL: imageURL,
    });

    // Update the profile in the authentication system
    await auth().currentUser.updateProfile({
      displayName: username,
      photoURL: imageURL,
    });

    return {
      email: user.email,
      uid: user.uid,
      displayName: username,
      photoURL: imageURL,
    };
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
