import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { RestaurantDetails } from "../api/google/googleTypes";
import geohash from "ngeohash";

export const saveFilters = async (room, filters, uid) => {
  try {
    const filtersCollection = collection(db, "filters");
    const userDoc = doc(filtersCollection, uid);

    await updateDoc(userDoc, {
      [room ? "room" : "swipe"]: filters,
    });

    console.log("Filters saved successfully!");
  } catch (error) {
    console.log("Error saving filters:", error);
  }
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
    };

    const collectionsRef = collection(db, "places");
    const docRef = doc(collectionsRef, newRestaurant.place_id);

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
    return result;
  } catch (error) {
    console.log("Error fetching user profile:", error);
  }
};
