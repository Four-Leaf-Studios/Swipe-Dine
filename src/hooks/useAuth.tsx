import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useContext, useMemo } from "react";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import React, { useState, createContext } from "react";
import { auth, db, storage } from "../lib/firebase";
import Loading from "../screens/Loading";
import { collection, doc, updateDoc } from "firebase/firestore";
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
  firstTime: boolean;
  setFirstTime: Function;
  userInfo: Object;
  setUserInfo: Function;
  saveProfile: (image: string, username: string, user: User) => Promise<void>;
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
  saveProfile: async () => {},
  userInfo: null,
  setUserInfo: () => {},
});

export const AuthenticatedUserProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState(null);
  const [firstTime, setFirstTime] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Persisting the user.
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Check if the user has a profile
      if (!user.displayName) {
        setFirstTime(true);
      } else setFirstTime(false);
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

  const saveProfile = async (imageURI, username, user) => {
    try {
      // Convert data URL to a blob
      const response = await fetch(imageURI);
      const blob = await response.blob();

      // Create a storage reference with a unique filename
      const storageRef = ref(
        storage,
        `user-profiles/${user.uid}/${Date.now()}`
      );

      // Upload the blob to Firebase Storage (resumable)
      const uploadTask = uploadBytesResumable(storageRef, blob);

      // Wait for the upload to complete
      await new Promise((resolve, reject) => {
        uploadTask.on("state_changed", null, reject, async () => {
          // Get the download URL of the uploaded image
          const imageURL = await getDownloadURL(uploadTask.snapshot.ref);

          // Update the user profile in Firestore
          const usersRef = collection(db, "users");
          const usersDocumentRef = doc(usersRef, user.uid);
          await updateDoc(usersDocumentRef, {
            displayName: username,
            photoURL: imageURL,
            subscription: "basic",
            discovers: 5,
            matches: 3,
          });

          // Update the profile in the authentication system
          await updateProfile(user, {
            displayName: username,
            photoURL: imageURL,
          });

          console.log("User profile updated successfully");
        });
      });
    } catch (error) {
      console.log("Error updating user profile:", error);
    }
  };
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
      saveProfile,
      userInfo,
      setUserInfo,
    }),
    [
      user,
      signUp,
      signIn,
      loading,
      error,
      firstTime,
      setFirstTime,
      userInfo,
      setUserInfo,
    ]
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
