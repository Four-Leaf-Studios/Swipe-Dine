import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useFilters from "./useFilters";
import { useRecoilState } from "recoil";
import { roomState } from "../atoms/atoms";
import {
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "@firebase/firestore";
import firestore from "@react-native-firebase/firestore";

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
      const doc = firestore().doc(`rooms/${room?.code}`);
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
      const roomRef = `rooms/${roomCode}`;

      const roomDoc = await firestore().doc(roomRef).get();

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = [...roomData.members, user.uid];

        await firestore().doc(roomRef).update({ members: updatedMembers });

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
        .doc(`rooms/${roomCode}`)
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

      await firestore().doc(`rooms/${roomCode}`).set(roomData);
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
      // Your remaining code...
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
