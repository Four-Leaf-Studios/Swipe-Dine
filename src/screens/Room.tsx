import { TouchableOpacity, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../components/Box";
import Text from "../components/Text";
import useRoom from "../hooks/useRoom";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";
import MemberItem from "../components/MemberItem";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";

const Room = ({ navigation }) => {
  const { user } = useAuth();
  const { room, leaveRoom, loading, handleStart, startBegan, filters } =
    useRoom();

  useEffect(() => {
    if (!room) navigation.navigate("Match");
  }, [room]);

  useEffect(() => {
    if (room?.restaurants)
      navigation.navigate("MatchDiscover", {
        room: room,
        filters: filters,
      });
  }, [room?.restaurants]);

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity
            onPress={async () => {
              leaveRoom(room?.code, user.uid);
            }}
          >
            <Text variant="body" color="headerButtonText">
              Leave Room
            </Text>
          </TouchableOpacity>
        </Box>
      ),
      headerRight: () =>
        room.owner === user.uid ? (
          <Box paddingRight="l">
            <TouchableOpacity
              onPress={async () =>
                navigation.navigate("RoomFilters", {
                  room: true,
                  filters: filters,
                })
              }
            >
              <Text variant="body" color="headerButtonText">
                Filters
              </Text>
            </TouchableOpacity>
          </Box>
        ) : null,
    });
  }, []);

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
    <Box
      width="100%"
      flexGrow={1}
      padding="m"
      flexDirection="column"
      justifyContent={"space-between"}
      alignItems="center"
      gap={"m"}
    >
      <Box
        padding="s"
        flexDirection={"row"}
        justifyContent={"center"}
        alignItems="center"
      >
        <Text variant="subheader" color="orangeDark">
          {room?.code}
        </Text>
      </Box>

      {room && (
        <FlatList
          data={room?.members}
          keyExtractor={(item) => item}
          style={{
            width: "100%",
          }}
          numColumns={3}
          renderItem={({ item }) => <MemberItem memberId={item} />}
        />
      )}

      <Button
        variant="home"
        disabled={room?.owner !== user.uid && !startBegan && true}
        onPress={handleStart}
      >
        <Text variant="subheader" color="white">
          {room?.owner === user.uid ? "Start" : "Waiting..."}
        </Text>
      </Button>
    </Box>
  );
};

export default Room;
