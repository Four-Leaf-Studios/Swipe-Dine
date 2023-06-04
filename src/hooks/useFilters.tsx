import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";

interface Filters {
  BBQ: boolean;
  ["Ice Cream"]: boolean;
  ["Fast Food"]: boolean;
}

const useFilters = (room = null) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(db, "filters"), user.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const swipe = room
            ? docSnapshot.data().room
            : docSnapshot.data().swipe;
          setFilters(swipe);
        } else {
        }
      },
      (error) => {}
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
