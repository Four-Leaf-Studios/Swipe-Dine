import { useEffect, useState } from "react";
import useAuth, { UserInfo } from "./useAuth";
import firestore from "@react-native-firebase/firestore";
import { UserProfile } from "firebase/auth";
const useUserProfileFromFirestore = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [matched, setMatched] = useState([]);
  const [userProfile, setUserProfile] = useState<UserInfo>();

  useEffect(() => {
    const userRef = firestore().collection("users").doc(user.uid);

    const unsubscribe = userRef.onSnapshot((snapshot) => {
      const userData = snapshot.data() as UserInfo;
      if (userData) {
        // Do something with the favorites data
        setFavorites(userData?.favoritedRestaurants || []);
        setMatched(userData?.matchedRestaurants || []);
        setUserProfile(userData);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user.uid]);

  return { favorites, matched, userProfile };
};

export default useUserProfileFromFirestore;
