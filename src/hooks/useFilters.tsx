import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface Filters {
  BBQ: boolean;
  ["Ice Cream"]: boolean;
  ["Fast Food"]: boolean;
  Japanese: boolean;
  Chinese: boolean;
  Mexican: boolean;
  Indian: boolean;
  Bars: boolean;
}

const useFilters = (room = null, initialFilters = null) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters | null>(
    initialFilters
      ? initialFilters
      : {
          BBQ: false,
          ["Ice Cream"]: false,
          ["Fast Food"]: false,
          Bars: false,
          Japanese: false,
          Chinese: false,
          Mexican: false,
          Indian: false,
          Italian: false,
        }
  );

  useEffect(() => {
    const filtersRef = doc(db, "filters", user.uid);

    const unsubscribe = onSnapshot(
      filtersRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const filter = room
            ? docSnapshot.data()?.room
            : docSnapshot.data()?.swipe;
          if (
            filter !== undefined &&
            JSON.stringify(filter) !== JSON.stringify(filters)
          ) {
            // Merge the new fields from default filters to existing filters
            const updatedFilters = {
              ...filter,
              ...Object.keys(filters).reduce((acc, key) => {
                if (!(key in filter)) {
                  acc[key] = filters[key];
                }
                return acc;
              }, {}),
            };

            setFilters(updatedFilters);
          }
        } else {
          // Firestore path does not exist, set default filters here
          const docRef = doc(db, "filters", user.uid);
          const data = {
            swipe: { ...filters },
            room: { ...filters },
          };
          setDoc(docRef, data);
        }
      },
      (error) => {
        // Handle error if necessary
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  return { filters, setFilters };
};

export default useFilters;
