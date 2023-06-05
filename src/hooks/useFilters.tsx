import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useRecoilState } from "recoil";
import { filtersState, roomFiltersState } from "../atoms/atoms";

interface Filters {
  BBQ: boolean;
  ["Ice Cream"]: boolean;
  ["Fast Food"]: boolean;
}

const useFilters = (room = null) => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters | null>();
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(db, "filters"), user.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const filter = room
            ? docSnapshot.data().room
            : docSnapshot.data().swipe;
          if (JSON.stringify(filter) !== JSON.stringify(filters)) {
            setFilters(filter);
          }
        } else {
        }
      },
      (error) => {}
    );

    return () => unsubscribe();
  }, [user.uid]);

  return { filters, setFilters };
};

export default useFilters;
