import { Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Box from "./Box";

type Props = {
  memberId: string;
};

interface UserProfile {
  displayName: string;
  photoURL: string;
  email: string;
}
const MemberItem = ({ memberId }: Props) => {
  const [data, setData] = useState<UserProfile>();
  useEffect(() => {
    const findMemberData = async (memberId: string) => {
      const userRef = doc(db, "users", memberId);
      const userDoc = await getDoc(userRef);
      setData(userDoc.data() as UserProfile);
    };
    findMemberData(memberId);
  }, []);

  return (
    <Box margin="s">
      <Image
        source={{
          uri:
            data?.photoURL ||
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 999,
        }}
      />
    </Box>
  );
};

export default MemberItem;

const styles = StyleSheet.create({});
