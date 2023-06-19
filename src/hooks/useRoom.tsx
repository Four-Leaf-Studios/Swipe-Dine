import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useFilters from "./useFilters";
import { useRecoilState } from "recoil";
import { roomState } from "../atoms/atoms";
import firestore from "@react-native-firebase/firestore";
import { fetchNearbyPlacesFromFirestore } from "../lib/firebaseHelpers";
import { getUserLocation } from "../utils/geolocation";
import { getGooglePlaces } from "../api/google/google";
import { updateUserProfileInFirestore } from "../lib/firebaseHelpers";
import { storeGooglePlacesData } from "../lib/firebaseHelpers";

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
    const q = firestore()
      .collection("rooms")
      .where("members", "array-contains", user.uid);

    const unsubscribe = q.onSnapshot((querySnapshot) => {
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
      const doc = firestore().collection("rooms").doc(room?.code);
      unsubscribeDeletion = doc.onSnapshot((docSnapshot) => {
        if (!docSnapshot.exists) {
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
      const roomDoc = await firestore().collection("rooms").doc(roomCode).get();

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = [...roomData.members, user.uid];

        await firestore()
          .collection("rooms")
          .doc(roomCode)
          .update({ members: updatedMembers });

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
      await firestore()
        .collection("rooms")
        .doc(roomCode)
        .update({
          members: firestore.FieldValue.arrayRemove(user.uid),
        });
      setLoading(false);
      setRoom(null);
    } catch (error) {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    setLoading(true);
    try {
      const roomCode = generateCode(); // Generate the room code
      const roomData: Room = {
        owner: user.uid,
        members: [user.uid],
        code: roomCode,
        swiped: {},
      };

      await firestore().collection("rooms").doc(roomCode).set(roomData);
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
    owner: room ? room?.owner === user.uid : false,
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
