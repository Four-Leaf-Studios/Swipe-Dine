import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import useFilters from "./useFilters";
import { useRecoilState } from "recoil";
import { roomState } from "../atoms/atoms";
import {
  leaveRoomFirestore,
  storeGooglePlacesData,
  updateUserProfileInFirestore,
} from "../lib/firebaseHelpers";
import { getGooglePlaces } from "../api/google/google";
import { getUserLocation } from "../utils/geolocation";

interface Room {
  owner: string;
  members: string[];
  code: string;
  swiped: Object;
}
const useRoom = () => {
  const { user, userProfile } = useAuth();
  const [room, setRoom] = useRecoilState(roomState);
  const { filters, setFilters } = useFilters(room);
  const [code, setCode] = useState();
  const [loading, setLoading] = useState(false);
  const [startBegan, setStartBegan] = useState(false);
  useEffect(() => {
    setLoading(true);
    const roomsRef = collection(db, "rooms");

    const q = query(roomsRef, where("members", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const roomData = querySnapshot.docs[0].data() as Room;
        setRoom(roomData);
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    });

    let unsubscribeDeletion = null;
    if (room) {
      // Listen for document deletions
      const roomDocRef = doc(db, "rooms", room?.code);
      unsubscribeDeletion = onSnapshot(roomDocRef, (docSnapshot) => {
        if (!docSnapshot.exists()) {
          setRoom(null);
        }
      });
    }

    return () => {
      unsubscribe();
      unsubscribeDeletion && unsubscribeDeletion();
    };
  }, [user]);

  const joinRoom = async (roomCode) => {
    setLoading(true);
    try {
      const roomRef = doc(db, "rooms", roomCode);

      const roomDoc = await getDoc(roomRef);

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = [...roomData.members, user.uid];

        await updateDoc(roomRef, { members: updatedMembers });

        setRoom({ ...roomData, members: updatedMembers });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const leaveRoom = async (roomCode, user) => {
    try {
      setLoading(true);
      const success = await leaveRoomFirestore(roomCode, user);
      if (success) {
        setTimeout(() => {
          setRoom(null);
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      // Handle the error
    }
  };
  const createRoom = async () => {
    setLoading(true);
    try {
      const roomCode = generateCode(); // Generate the room code

      const roomRef = doc(db, "rooms", roomCode); // Set the room code as the document ID

      const roomData: Room = {
        owner: user.uid,
        members: [user.uid],
        code: roomCode,
        swiped: {},
      };

      await setDoc(roomRef, roomData);
      setLoading(false);
      setRoom(roomData);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleStart = async () => {
    setStartBegan(true);
    setLoading(true);
    if (!room.restaurants) {
      const location = await getUserLocation();
      const keywords = Object.entries(filters ? filters : {})
        .filter(([_, value]) => value === true)
        .map(([key]) => key.toLowerCase())
        .join(" | ");

      const results = [];
      let nextPageToken = null;
      const placeIds = new Set();

      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      const fetchPage = async () => {
        const response = await getGooglePlaces(
          `${location.latitude},${location.longitude}`,
          nextPageToken,
          keywords
        );

        if (response.results) {
          response.results.forEach((place) => {
            if (!placeIds.has(place.place_id)) {
              placeIds.add(place.place_id);
              results.push(place);
            }
          });

          nextPageToken = response.nextPageToken;

          if (nextPageToken) {
            await delay(1000); // Delay between API calls (2 seconds)
            await fetchPage(); // Call the next page recursively
          } else {
            const roomCode = room.code;
            await storeGooglePlacesData(roomCode, results);
            setLoading(false);
          }
        } else {
          console.error(response.error);
        }
      };

      await fetchPage();
      await updateUserProfileInFirestore(user.uid, {
        ...userProfile,
        rooms: userProfile.rooms - 1,
      });
    }
  };

  // Function to generate a random code
  const generateCode = () => {
    const length = 6;
    const characters = "0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  };

  return {
    room,
    owner: room ? (room?.owner === user.uid ? true : false) : false,
    code,
    setCode,
    createRoom,
    joinRoom,
    leaveRoom,
    filters,
    setLoading,
    loading,
    handleStart,
    startBegan,
    setFilters,
  };
};

export default useRoom;
