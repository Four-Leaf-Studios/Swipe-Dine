import { TouchableOpacity, FlatList } from "react-native";
import React, { useEffect } from "react";
import Box from "../components/Box";
import Text from "../components/Text";
import useRoom from "../hooks/useRoom";
import Layout from "../components/Layout";
import MemberItem from "../components/MemberItem";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import Filters from "../components/Filters";

const Room = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray } = theme.colors;
  const { user, userProfile } = useAuth();
  const {
    room,
    leaveRoom,
    loading,
    handleStart,
    startBegan,
    filters,
    setFilters,
  } = useRoom();

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
      headerStyle: { backgroundColor: darkGray },
      headerTitleStyle: { color: "white" },
      title: room.code,
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity
            onPress={async () => {
              leaveRoom(room?.code, user.uid);
            }}
          >
            <Text variant="body" color="white">
              Leave Room
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, []);

  return (
    <Layout variant="main">
      <Box
        width="100%"
        flex={1}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          width="100%"
          height="80%"
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor="darkGray"
          padding="m"
          paddingBottom="xl"
          gap="m"
        >
          {room && (
            <FlatList
              data={room?.members}
              keyExtractor={(item) => item}
              style={{
                width: "100%",
                height: "100%",
              }}
              numColumns={3}
              renderItem={({ item }) => <MemberItem memberId={item} />}
            />
          )}
        </Box>
        <Box
          width="100%"
          position="absolute"
          bottom={0}
          backgroundColor={"darkGray"}
        >
          <Box
            height="100%"
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
            gap="l"
          >
            <Box width="100%" flex={1} gap={"l"}>
              {filters && room?.owner === user.uid && (
                <Filters filters={filters} setFilters={setFilters} />
              )}
            </Box>
            <Button
              variant="home"
              disabled={room?.owner !== user.uid && !startBegan && true}
              onPress={handleStart}
            >
              <Text variant="subheader" color="white">
                {room?.owner === user.uid ? "Start" : "Waiting..."}{" "}
                {room?.owner === user.uid && (
                  <Text variant="body" color="white" fontWeight="bold">
                    ({userProfile.rooms})
                  </Text>
                )}
              </Text>
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Room;
