import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import geohash from "ngeohash";
import { saveImage } from "../api/google/google";
import { updateProfile } from "firebase/auth";
import { UserInfo } from "../hooks/useAuth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const saveFilters = async (room, filters, uid) => {
  try {
    const filtersCollection = collection(db, "filters");
    const userDoc = doc(filtersCollection, uid);

    await updateDoc(userDoc, {
      [room ? "room" : "swipe"]: filters,
    });
  } catch (error) {}
};

export const storeGooglePlacesData = async (roomCode, data) => {
  const roomRef = collection(db, "rooms");
  const docRef = doc(roomRef, roomCode);
  await updateDoc(docRef, {
    restaurants: data,
  });
};

export const leaveRoomFirestore = async (roomCode, userId) => {
  try {
    const roomRef = doc(db, "rooms", roomCode);

    const roomDoc = await getDoc(roomRef);

    const roomData = roomDoc.data();
    if (roomData) {
      const updatedMembers = roomData.members.filter(
        (member) => member !== userId
      );

      if (roomData.owner === userId) {
        // If the current user is the owner, delete the room document
        await deleteDoc(roomRef);
      } else {
        await updateDoc(roomRef, { members: updatedMembers });
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

export const uploadRestaurantDetailsToFirestore = async (restaurant) => {
  try {
    const coordinates = restaurant.geometry.location;
    const lat = coordinates.lat;
    const lon = coordinates.lng;

    const hash = geohash.encode(lat, lon);
    const updatedTimestamp = serverTimestamp();

    const newRestaurant = {
      ...restaurant,
      geohash: hash,
      updated: updatedTimestamp,
      photos: [],
    };

    const collectionsRef = collection(db, "places");
    const docRef = doc(collectionsRef, restaurant.place_id);

    if (restaurant.photos[0].photo_reference)
      for (const photo of restaurant.photos) {
        const photoUrl = await saveImage(photo.photo_reference);
        // Update newRestaurant.photos with Firestore storage URL
        newRestaurant.photos.push({
          photoUrl: photoUrl,
        });
      }
    else newRestaurant.photos = restaurant.photos;

    await setDoc(docRef, newRestaurant);

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkDocumentExists = async (placeId) => {
  try {
    const docRef = doc(db, "places", placeId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
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
    const usersCollection = collection(db, "users");
    const usersDoc = doc(usersCollection, user.uid);
    const result = await getDoc(usersDoc);
    return result.data() as UserInfo;
  } catch (error) {}
};

export const fetchNearbyPlacesFromFirestore = async (
  location,
  distance, // In Miles
  filters
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

    const placesRef = collection(db, "places");
    const q = query(
      placesRef,
      where("geohash", ">=", range.lower),
      where("geohash", "<=", range.upper),
      where("types", "array-contains-any", filterKeys)
    );

    const querySnapshot = await getDocs(q);
    const places = querySnapshot.docs.map((doc) => doc.data());
    return places;
  } catch (error) {
    // Handle the error here
    console.error("Error fetching nearby places:", error);
    return []; // Return an empty array or any other appropriate value
  }
};

// Calculate the upper and lower boundary geohashes for
// a given latitude, longitude, and distance in miles
const getGeohashRange = (
  latitude: number,
  longitude: number,
  distance: number // miles
) => {
  const lat = 0.0144927536231884; // degrees latitude per mile
  const lon = 0.0181818181818182; // degrees longitude per mile

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
    const usersRef = collection(db, "users");
    const userRef = doc(usersRef, userId);

    // Get the user's current matched restaurants array
    const userDoc = await getDoc(userRef);
    const matchedRestaurants = userDoc.data().matchedRestaurants || [];

    // Check if the placeId is already in the matched restaurants array
    if (!matchedRestaurants.includes(placeId)) {
      // Add the new placeId to the matched restaurants array
      const updatedMatchedRestaurants = [...matchedRestaurants, placeId];

      // Update the user document with the updated matched restaurants array
      await updateDoc(userRef, {
        matchedRestaurants: updatedMatchedRestaurants,
      });
    } else {
    }
  } catch (error) {
    throw error;
  }
};

export const addRestaurantToFavoritesListInFirestore = async (
  placeId,
  userId
) => {
  try {
    const usersRef = collection(db, "users");
    const userRef = doc(usersRef, userId);

    // Get the user's current matched restaurants array
    const userDoc = await getDoc(userRef);
    const favoritedRestaurants = userDoc.data().favoritedRestaurants || [];

    // Check if the placeId is already in the matched restaurants array
    if (!favoritedRestaurants.includes(placeId)) {
      // Add the new placeId to the matched restaurants array
      const updatedFavoritedRestaurants = [...favoritedRestaurants, placeId];

      // Update the user document with the updated matched restaurants array
      await updateDoc(userRef, {
        favoritedRestaurants: updatedFavoritedRestaurants,
      });
    } else {
    }
  } catch (error) {
    throw error;
  }
};

export const removeRestaurantFromFavoritesInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = doc(db, "users", userId);

    // Get the user's current favorites array
    const userDoc = await getDoc(userRef);
    const favorites = userDoc.data().favoritedRestaurants || [];

    // Remove the placeId from the favorites array
    const updatedFavorites = favorites.filter(
      (restaurantId) => restaurantId !== placeId
    );

    // Update the user document with the updated favorites array
    await updateDoc(userRef, { favoritedRestaurants: updatedFavorites });
  } catch (error) {
    throw error;
  }
};

export const removeRestaurantFromMatchedInFirestore = async (
  placeId,
  userId
) => {
  try {
    const userRef = doc(db, "users", userId);

    // Get the user's current favorites array
    const userDoc = await getDoc(userRef);
    const matched = userDoc.data().matchedRestaurants || [];

    // Remove the placeId from the favorites array
    const updatedMatchedRestaurants = matched.filter(
      (restaurantId) => restaurantId !== placeId
    );

    // Update the user document with the updated favorites array
    await updateDoc(userRef, { matchedRestaurants: updatedMatchedRestaurants });
  } catch (error) {
    throw error;
  }
};

export const updateUserProfileInFirestore = async (uid, userProfile) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, userProfile);
  } catch (error) {}
};

export const saveProfile = async (imageURI, username, user) => {
  try {
    // Convert data URL to a blob
    const response = await fetch(imageURI);
    const blob = await response.blob();

    // Create a storage reference with a unique filename
    const storageRef = ref(storage, `user-profiles/${user.uid}/${Date.now()}`);

    // Upload the blob to Firebase Storage (resumable)
    const uploadTask = uploadBytesResumable(storageRef, blob);

    const uploadSnapshot = await uploadTask;

    if (uploadSnapshot.state === "success") {
      const imageURL = await getDownloadURL(uploadSnapshot.ref);

      // Update the user profile in Firestore
      const usersRef = collection(db, "users");
      const usersDocumentRef = doc(usersRef, user.uid);
      const newUserInfo = {
        email: user.email,
        uid: user.uid,
        displayName: username,
        photoURL: imageURL,
      };
      await updateDoc(usersDocumentRef, { ...newUserInfo });

      // Update the profile in the authentication system
      await updateProfile(user, {
        displayName: username,
        photoURL: imageURL,
      });

      return newUserInfo;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
