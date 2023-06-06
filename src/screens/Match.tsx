import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Box from "../components/Box";
import Button from "../components/Button";
import StyledTextInput from "../components/StyledTextInput";
import useRoom from "../hooks/useRoom";
import AnimatedLogo from "../components/AnimatedLogo";
import { useIsFocused } from "@react-navigation/native";

interface Room {
  owner: string;
  members: string[];
  code: string;
}
const Match = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [code, setCode] = useState("");
  const { room, createRoom, joinRoom, loading } = useRoom();
  const handleSubmit = () => {
    joinRoom(code);
    setCode("");
  };

  useEffect(() => {
    if (room && isFocused) {
      navigation.navigate("Room");
    }
  }, [room, navigation, isFocused]);

  if (loading)
    return (
      <Layout variant="main">
        <Box
          width="100%"
          height="100%"
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems="center"
        >
          <AnimatedLogo variant="secondary" />
        </Box>
      </Layout>
    );
  return (
    <Layout variant="main">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box
          flex={1}
          width="100%"
          justifyContent="center"
          alignItems="center"
          padding="m"
          gap={"m"}
        >
          <Button
            variant="home"
            onPress={async () => {
              createRoom();
            }}
          >
            <Text variant="subheader" color="white">
              Create a Room
            </Text>
          </Button>
          <Text variant="body">OR</Text>
          <StyledTextInput
            variant="room"
            placeholder={"Join with room code!"}
            keyboardType={"number-pad"}
            value={code}
            message={""}
            onChangeText={setCode}
            color={"darkGray"}
            onEndSubmit={handleSubmit}
          />
        </Box>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default Match;
