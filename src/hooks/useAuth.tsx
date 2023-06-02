import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useContext, useEffect, useMemo } from "react";

import React, { useState, createContext } from "react";
import { auth } from "../lib/firebase";
import Loading from "../screens/Loading";
interface IAuth {
  user: User | null;
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
});

export const AuthenticatedUserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Persisting the user.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Logged in...
        setUser(user);
        setLoading(false);
      } else {
        // Not logged in...
        setUser(null);
        setLoading(true);
      }
      // Temporary, mimics loading data.
      setTimeout(() => setInitialLoading(false), 4000);
    });
  }, []);
  const signUp = async (email, password) => {
    let errors = {
      email: null,
      password: null,
    };
    setLoading(true);
    try {
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
    }),
    [user, signUp, signIn, loading, error]
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
