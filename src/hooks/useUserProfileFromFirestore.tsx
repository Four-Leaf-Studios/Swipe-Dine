import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const useUserProfileFromFirestore = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const userData = snapshot.data();
      if (userData) {
        const favorites = userData.favorites;
        // Do something with the favorites data
        setFavorites(userData?.favoritedRestaurants || []);
        setMatched(userData?.matchedRestaurants || []);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  return { favorites, matched };
};

export default useUserProfileFromFirestore;
