import {
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import Layout from "../components/Layout";
import Text from "../components/Text";
import Box from "../components/Box";
import Button from "../components/Button";
import useRoom from "../hooks/useRoom";
import StyledTextInput from "../components/StyledTextInput";

const Room = ({ navigation }) => {
  const {
    room,
    owner,
    code,
    setCode,
    createRoom,
    leaveRoom,
    joinRoom,
    filters,
    setFilters,
  } = useRoom();
  return (
    <Layout variant="main">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box
          flex={1}
          width="100%"
          flexDirection="column"
          justifyContent={room ? "space-between" : "center"}
          alignItems="center"
          padding="l"
          gap="m"
        >
          {/* Room Code */}
          {room && (
            <Button variant="home" onPress={() => {}}>
              <Text variant="subheader" color="buttonPrimaryText">
                {room.code}
              </Text>
            </Button>
          )}

          {room && (
            <>
              <Box
                width="100%"
                flexGrow={0}
                flexDirection="row"
                justifyContent={"center"}
                flexWrap={"wrap"}
                gap="m"
                paddingTop="l"
              >
                <Box
                  borderRadius={999}
                  backgroundColor={"buttonPrimaryBackground"}
                  flexDirection="row"
                  justifyContent={"center"}
                  alignItems="center"
                  padding="l"
                >
                  <Text variant="subheader" color="buttonPrimaryText">
                    Seth
                  </Text>
                </Box>
                <Box
                  borderRadius={999}
                  backgroundColor={"buttonPrimaryBackground"}
                  flexDirection="row"
                  justifyContent={"center"}
                  alignItems="center"
                  padding="l"
                >
                  <Text variant="subheader" color="buttonPrimaryText">
                    JD
                  </Text>
                </Box>
                <Box
                  borderRadius={999}
                  backgroundColor={"buttonPrimaryBackground"}
                  flexDirection="row"
                  justifyContent={"center"}
                  alignItems="center"
                  padding="l"
                >
                  <Text variant="subheader" color="buttonPrimaryText">
                    Caleb
                  </Text>
                </Box>
              </Box>
            </>
          )}

          <Box
            width="100%"
            flex={{ phone: 4, longPhone: 2, tablet: 1 }}
            gap="m"
            flexDirection="column"
            justifyContent={room ? "flex-end" : "center"}
            alignItems="center"
          >
            {!room && (
              <StyledTextInput
                placeholder="Enter Room Code"
                keyboardType={"decimal-pad"}
                variant="room"
                value={code}
                message={""}
                onChangeText={setCode}
                color="buttonSecondaryText"
              />
            )}
            <Button
              variant="home"
              onPress={() =>
                room
                  ? navigation.navigate("SwipeScreen", { room: room })
                  : joinRoom(code)
              }
            >
              <Text variant="subheader" color="buttonPrimaryText">
                {room
                  ? owner
                    ? "Start Looking"
                    : "Waiting on Owner..."
                  : "Join Room"}
              </Text>
            </Button>

            {!room && (
              <Button variant="home" onPress={createRoom}>
                <Text
                  variant="subheader"
                  color="buttonPrimaryText"
                  textAlign={"center"}
                >
                  Create a Room
                </Text>
              </Button>
            )}
            {room && owner && (
              <Button variant="home" onPress={() => navigation.navigate()}>
                <Text variant="subheader" color="buttonPrimaryText">
                  Edit Filters
                </Text>
              </Button>
            )}

            {room && owner && (
              <Button variant="home" onPress={() => leaveRoom(room.code)}>
                <Text variant="subheader" color="buttonPrimaryText">
                  End Session
                </Text>
              </Button>
            )}
          </Box>
        </Box>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

export default Room;

const styles = StyleSheet.create({});
