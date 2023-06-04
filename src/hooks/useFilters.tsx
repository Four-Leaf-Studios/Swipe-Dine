import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const useFilters = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Object | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(db, "filters"), user.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const swipe = docSnapshot.data().swipe;
          setFilters(swipe);
        } else {
          // Handle the case where the document doesn't exist
          console.log("Document not found");
        }
      },
      (error) => {
        console.log("Error listening to filters:", error);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  const saveFilters = async () => {
    try {
      const filtersCollection = collection(db, "filters");
      const userDoc = doc(filtersCollection, user.uid);

      await updateDoc(userDoc, {
        swipe: filters,
      });

      console.log("Filters saved successfully!");
    } catch (error) {
      console.log("Error saving filters:", error);
    }
  };

  return { filters, setFilters, saveFilters };
};

export default useFilters;
