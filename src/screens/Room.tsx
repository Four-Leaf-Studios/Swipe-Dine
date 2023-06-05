import { StyleSheet, TouchableOpacity, View, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Box from "../components/Box";
import Text from "../components/Text";
import useRoom from "../hooks/useRoom";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";
import MemberItem from "../components/MemberItem";
import Button from "../components/Button";

const Room = ({ navigation }) => {
  const { room, leaveRoom, loading } = useRoom();
  useEffect(() => {
    if (!room) navigation.navigate("Match");
  }, [room]);

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity
            onPress={async () => {
              leaveRoom(room?.code);
            }}
          >
            <Text variant="body" color="headerButtonText">
              Leave Room
            </Text>
          </TouchableOpacity>
        </Box>
      ),
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
    <View>
      <Text variant="body">Room {room?.code}</Text>
      {room && (
        <FlatList
          data={room?.members}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <MemberItem memberId={item} />}
        />
      )}

      <Button
        variant="home"
        onPress={() => navigation.navigate("Matching", { room: room })}
      >
        <Text variant="body">Start</Text>
      </Button>
    </View>
  );
};

export default Room;
