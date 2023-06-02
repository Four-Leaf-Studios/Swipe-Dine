import { User, onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useMemo } from "react";

import React, { useState, createContext } from "react";
import { auth } from "../lib/firebase";
import Loading from "../screens/Loading";

export const AuthenticatedUserContext = createContext({});

export const AuthenticatedUserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Persisting the user.
  useEffect(() => {}, []);

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

  const signUp = async () => {};
  const signIn = async () => {};
  const logout = async () => {};

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
