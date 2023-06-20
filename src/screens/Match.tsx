import { Keyboard, TouchableWithoutFeedback } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Box from "../components/Box";
import Button from "../components/Button";
import StyledTextInput from "../components/StyledTextInput";
import useRoom from "../hooks/useRoom";
import { useIsFocused } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const Match = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray } = theme.colors;
  const isFocused = useIsFocused();
  const [code, setCode] = useState("");
  const { room, createRoom, joinRoom, loading } = useRoom();
  const handleSubmit = () => {
    joinRoom(code);
    setCode("");
  };

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerStyle: {
        backgroundColor: loading ? "white" : darkGray,
      },
      headerTitleStyle: {
        color: loading ? darkGray : "white",
      },
    });
  }, [navigation, loading]);

  useEffect(() => {
    if (room && isFocused) {
      navigation.navigate("Room");
    }
  }, [room, navigation, isFocused]);

  return (
    <Layout variant="white" gradient>
      <Box
        width="100%"
        flex={1}
        backgroundColor={"darkGray"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Box
          width="100%"
          height={{ phone: "40%", longPhone: "60%", tablet: "70%" }}
          justifyContent={"center"}
          alignItems={"center"}
          padding="l"
          paddingBottom="xl"
        >
          <Text
            variant={{ phone: "body", tablet: "subheader" }}
            color="white"
            fontSize={{ phone: 22, tablet: 36 }}
            fontWeight={"normal"}
          >
            Create a{" "}
            <Text
              variant={{ phone: "subheader", tablet: "header" }}
              color="orangeDark"
            >
              ROOM
            </Text>{" "}
            and search for{" "}
            <Text
              variant={{ phone: "subheader", tablet: "header" }}
              color="orangeDark"
            >
              FOOD
            </Text>{" "}
            with{" "}
            <Text
              variant={{ phone: "subheader", tablet: "header" }}
              color="orangeDark"
            >
              FRIENDS
            </Text>{" "}
          </Text>
        </Box>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Box
            position="absolute"
            height={{ phone: "60%", longPhone: "40%", tablet: "30%" }}
            bottom={0}
            width="100%"
            justifyContent="center"
            alignItems="center"
            backgroundColor={"darkGray"}
          >
            <Box
              height="100%"
              width="100%"
              justifyContent={"space-between"}
              alignItems="center"
              overflow="hidden"
              shadowColor={"white"}
              borderTopLeftRadius={20}
              borderTopRightRadius={20}
              backgroundColor={"white"}
              shadowOpacity={0.25}
              elevation={4}
              shadowRadius={4}
              shadowOffset={{ width: 0, height: -4 }}
              padding="l"
            >
              <Button variant="match" onPress={createRoom}>
                <Text variant="body" color="white">
                  Create a Room
                </Text>
              </Button>
              <Text variant="body" color="darkGray">
                OR
              </Text>
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
          </Box>
        </TouchableWithoutFeedback>
      </Box>
    </Layout>
  );
};

export default Match;
