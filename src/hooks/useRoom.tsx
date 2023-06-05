import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
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

interface Room {
  owner: string;
  members: string[];
  code: string;
}
const useRoom = () => {
  const { user } = useAuth();
  const [room, setRoom] = useRecoilState(roomState);
  const { filters, setFilters } = useFilters(true);

  const [code, setCode] = useState();

  const [loading, setLoading] = useState(false);

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
      unsubscribeDeletion();
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

  const leaveRoom = async (roomCode) => {
    try {
      setLoading(true);

      const roomRef = doc(db, "rooms", roomCode);

      const roomDoc = await getDoc(roomRef);

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = roomData.members.filter(
          (member) => member !== user.uid
        );

        if (roomData.owner === user.uid) {
          // If the current user is the owner, delete the room document
          await deleteDoc(roomRef);
        } else {
          await updateDoc(roomRef, { members: updatedMembers });
        }
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
      };

      await setDoc(roomRef, roomData);
      setLoading(false);
      setRoom(roomData);
    } catch (error) {
      setLoading(false);
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
    setFilters,
    setLoading,
    loading,
  };
};

export default useRoom;
