import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import firestore from "@react-native-firebase/firestore";
const useUserProfileFromFirestore = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [matched, setMatched] = useState([]);

  useEffect(() => {
    const userRef = firestore().collection("users").doc(user.uid);

    const unsubscribe = userRef.onSnapshot((snapshot) => {
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
