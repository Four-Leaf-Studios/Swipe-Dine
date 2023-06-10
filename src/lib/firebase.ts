import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAC8Jkq4QG-kwevwsGjfjv_J_oeX8ZF9is",
  authDomain: "foodr-388417.firebaseapp.com",
  projectId: "foodr-388417",
  storageBucket: "foodr-388417.appspot.com",
  messagingSenderId: "291562557089",
  appId: "1:291562557089:web:5315c40000f3362a926ae0",
  measurementId: "G-YG7NMBK5RM",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
