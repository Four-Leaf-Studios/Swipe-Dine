import { TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import SwipeCard from "../components/SwipeCard";
import Text from "../components/Text";
import { leaveRoomFirestore } from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";
import useRoom from "../hooks/useRoom";

const MatchDiscover = ({ navigation, route }) => {
  const { user } = useAuth();
  const { room } = route.params;
  const [restaurants, setRestaurants] = useState(room?.restaurants);
  const handleSwipe = (direction: string, index: number) => {
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    // Remove the restaurant from the restaurants list

    if (direction === "left") {
    }
    if (direction === "right") {
    }

    setRestaurants(updatedRestaurants);
  };

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
              leaveRoomFirestore(room?.code, user.uid);
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

  return (
    <Layout variant="main">
      <Box width="100%" flex={1} padding="s">
        <Box
          position="relative"
          width="100%"
          flex={10}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          {restaurants.map((restaurant, index) => (
            <SwipeCard
              key={restaurant.place_id + index}
              restaurant={restaurant}
              handleSwipe={handleSwipe}
              index={index}
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default MatchDiscover;
