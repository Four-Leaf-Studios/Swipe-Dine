import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

type Props = {
  memberId: string;
};

const MemberItem = ({ memberId }: Props) => {
  const [data, setData] = useState<any | null>();
  useEffect(() => {
    const findMemberData = async (memberId) => {
      const userRef = doc(db, "users", memberId);
      const userDoc = await getDoc(userRef);
      setData(userDoc.data());
    };
    findMemberData(memberId);
  }, []);
  return (
    <View>
      <Text>{data?.email}</Text>
    </View>
  );
};

export default MemberItem;

const styles = StyleSheet.create({});
