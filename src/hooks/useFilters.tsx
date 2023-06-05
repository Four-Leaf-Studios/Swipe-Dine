import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { filtersState, roomState } from "../atoms/atoms";

interface Filters {
  BBQ: boolean;
  ["Ice Cream"]: boolean;
  ["Fast Food"]: boolean;
}

const useFilters = () => {
  const { user } = useAuth();
  const [recoilFilter, setRecoilFilter] = useRecoilState(filtersState);
  const [filters, setFilters] = useState<Filters | null>();
  const room = useRecoilValue(roomState);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(collection(db, "filters"), user.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const filter = room
            ? docSnapshot.data().room
            : docSnapshot.data().swipe;
          setFilters(filter);
          if (filter !== recoilFilter) setRecoilFilter(filter);
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
