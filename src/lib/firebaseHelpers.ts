import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

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
