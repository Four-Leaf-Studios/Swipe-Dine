import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useContext, useEffect, useMemo } from "react";
import React, { useState, createContext } from "react";
import { auth, db } from "../lib/firebase";
import Loading from "../screens/Loading";
import { fetchUserProfile } from "../lib/firebaseHelpers";
import { doc, onSnapshot } from "firebase/firestore";

interface IAuth {
  user: User | null | UserInfo;
  signUp: (
    email: string,
    password: string
  ) => Promise<null | { email: string | null; password: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<null | { email: string | null; password: string | null }>;
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
    free: boolean;
    standard: boolean;
    premium: boolean;
  };
}

const AuthenticatedUserContext = createContext<IAuth>({
  user: null,
  signUp: async (email: string, password: string) => {
    return Promise.reject("signUp function not implemented");
  },
  signIn: async (email: string, password: string) => {
    return Promise.reject("signUp function not implemented");
  },
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserInfo | null>(null);
  const [firstTime, setFirstTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if the user has a profile
        if (!user.displayName) {
          setFirstTime(true);
        } else {
          setFirstTime(false);
        }

        // Logged in...
        try {
          const profile: UserInfo = await fetchUserProfile(user);
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
    const usersRef = doc(db, "users", user?.uid);

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      // Handle the user document update here
      const userData = snapshot.data() as UserInfo;
      setUserProfile(userData);
      // Perform any necessary actions or update state based on userData
    });

    return () => {
      // Unsubscribe from the Firestore listener when the component unmounts
      unsubscribe();
    };
  }, [user?.uid]);

  const signUp = async (email, password) => {
    let errors = {
      email: null,
      password: null,
    };
    setLoading(true);

    try {
      setFirstTime(true);
      await createUserWithEmailAndPassword(auth, email, password);
      return null;
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          errors.email = "The email address is already in use.";
          break;
        case "auth/invalid-email":
          errors.email = "The email address is invalid.";
          break;
        case "auth/weak-password":
          errors.password = "The password is too weak.";
          break;
        default:
          errors.email = "An error occurred during sign up.";
          break;
      }
      setLoading(false);
      return errors;
    }
  };

  const signIn = async (email, password) => {
    let errors = {
      email: null,
      password: null,
    };

    try {
      // Perform sign-in logic here, e.g., using Firebase's signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, email, password);

      return null; // Sign in successful
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          errors.email = "The email address is invalid.";
          break;
        case "auth/user-disabled":
          errors.email = "The user account has been disabled.";
          break;
        case "auth/user-not-found":
          errors.email = "User not found.";
          break;
        case "auth/wrong-password":
          errors.password = "Invalid password.";
          break;
        default:
          errors.email = "An error occurred during sign in.";
          break;
      }

      return errors;
    }
  };

  const logout = async () => signOut(auth);

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      loading,
      logout,
      error,
      firstTime,
      setFirstTime,
      setUserProfile,
      userProfile,
    }),
    [user, signUp, signIn, loading, error, firstTime, setFirstTime]
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
