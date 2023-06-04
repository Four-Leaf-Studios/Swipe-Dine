import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
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

interface Room {
  owner: string;
  members: string[];
  code: string;
}
const useRoom = () => {
  const { user } = useAuth();
  const { filters, setFilters } = useFilters(true);
  const [room, setRoom] = useState<Room>();
  const [code, setCode] = useState();

  useEffect(() => {
    const roomsRef = collection(db, "rooms");

    const q = query(roomsRef, where("members", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const roomData = querySnapshot.docs[0].data() as Room;
        setRoom(roomData);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const joinRoom = async (roomCode) => {
    try {
      const roomRef = doc(db, "rooms", roomCode);

      const roomDoc = await getDoc(roomRef);

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = [...roomData.members, user.uid];

        await updateDoc(roomRef, { members: updatedMembers });

        setRoom({ ...roomData, members: updatedMembers });
      }
    } catch (error) {}
  };

  const leaveRoom = async (roomCode) => {
    try {
      const roomRef = doc(db, "rooms", roomCode);

      const roomDoc = await getDoc(roomRef);

      const roomData = roomDoc.data() as Room;
      if (roomData) {
        const updatedMembers = roomData.members.filter(
          (member) => member !== user.uid
        );

        await updateDoc(roomRef, { members: updatedMembers });

        setRoom(null);
      }
    } catch (error) {}
  };

  const createRoom = async () => {
    try {
      const roomCode = generateCode(); // Generate the room code

      const roomRef = doc(db, "rooms", roomCode); // Set the room code as the document ID

      const roomData: Room = {
        owner: user.uid,
        members: [user.uid],
        code: roomCode,
      };

      await setDoc(roomRef, roomData);
      setRoom(roomData);
    } catch (error) {}
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
  };
};

export default useRoom;

const styles = StyleSheet.create({});
