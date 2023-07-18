import { useContext, useEffect, useMemo } from "react";
import React, { useState, createContext } from "react";
import Loading from "../screens/Loading";
import { fetchUserProfile } from "../lib/firebaseHelpers";
import fireAuth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

interface IAuth {
  user: FirebaseAuthTypes.User | null | UserInfo;
  logout: () => Promise<void>;
  error: string | null;
  loading: boolean;
  firstTime: boolean;
  setFirstTime: Function;
  setUserProfile: Function;
  userProfile: UserInfo | null;
}

export interface UserInfo {
  email: string;
  photoURL: string;
  displayName: string;
  uid: string;
  discovers: number;
  rooms: number;
  favoritedRestaurants: string[];
  matchedRestaurants: string[];
  subscriptions: {
    free: string;
    standard: string;
    premium: string;
  };
}

const AuthenticatedUserContext = createContext<IAuth>({
  user: null,
  logout: async () => {},
  error: null,
  loading: false,
  firstTime: false,
  setFirstTime: () => {},
  setUserProfile: () => {},
  userProfile: null,
});

export const AuthenticatedUserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserInfo | null>(null);
  const [firstTime, setFirstTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = fireAuth().onAuthStateChanged(async (user) => {
      if (user) {
        // Check if the user has a profile
        console.log(user.photoURL);
        if (user.photoURL) {
          setFirstTime(false);
        } else {
          setFirstTime(true);
        }

        // Logged in...
        try {
          const profile: UserInfo = (await fetchUserProfile(user)) as UserInfo;
          setUserProfile(profile);
          setUser(user);
          setLoading(false);
        } catch (error) {}
      } else {
        // Not logged in...
        setUser(null);
        setLoading(true);
      }
      // Temporary, mimics loading data.
      setTimeout(() => setInitialLoading(false), 4000);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const usersRef = firestore().collection("users").doc(user.uid);

    const unsubscribe = usersRef.onSnapshot((snapshot) => {
      // Handle the user document update here
      const userData = snapshot.data() as UserInfo;
      setUserProfile(userData);
      // Perform any necessary actions or update state based on userData
    });

    return () => {
      // Unsubscribe from the Firestore listener when the component unmountsr
      unsubscribe();
    };
  }, [user?.uid]);

  const logout = async () => fireAuth().signOut();

  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      logout,
      error,
      firstTime,
      setFirstTime,
      setUserProfile,
      userProfile,
    }),
    [user, loading, error, firstTime, setFirstTime, userProfile]
  );

  return (
    <AuthenticatedUserContext.Provider value={memoedValue}>
      {initialLoading ? <Loading /> : children}
    </AuthenticatedUserContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthenticatedUserContext);
}
