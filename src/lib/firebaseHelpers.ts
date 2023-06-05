import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveFilters = async (filters, uid) => {
  try {
    const filtersCollection = collection(db, "filters");
    const userDoc = doc(filtersCollection, uid);

    await updateDoc(userDoc, {
      swipe: filters,
    });

    console.log("Filters saved successfully!");
  } catch (error) {
    console.log("Error saving filters:", error);
  }
};
