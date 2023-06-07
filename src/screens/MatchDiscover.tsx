import { TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import SwipeCard from "../components/SwipeCard";
import Text from "../components/Text";
import { leaveRoomFirestore } from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";
import useRoom from "../hooks/useRoom";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const MatchDiscover = ({ navigation, route }) => {
  const { user } = useAuth();
  const { room } = route.params;
  const [restaurants, setRestaurants] = useState(room?.restaurants);
  const handleSwipe = async (direction: string, index: number) => {
    const updatedRestaurants = restaurants.filter((_, i) => i !== index);
    // Remove the restaurant from the restaurants list

    if (direction === "left") {
    }
    if (direction === "right") {
      const swipedPlaceId = restaurants[index].place_id;
      const updatedSwiped = { ...room.swiped };

      if (updatedSwiped.hasOwnProperty(swipedPlaceId)) {
        // Place ID already exists in swiped, add user to existing array
        updatedSwiped[swipedPlaceId] = [
          ...updatedSwiped[swipedPlaceId],
          user.uid,
        ];
      } else {
        // Place ID doesn't exist in swiped, create a new array with the user
        updatedSwiped[swipedPlaceId] = [user.uid];
      }

      // Update the swiped field in the Firestore document
      // Replace 'roomDocRef' with the reference to the Firestore document
      const roomCollectionRef = collection(db, "rooms");
      const roomDocRef = doc(roomCollectionRef, room.code);
      await updateDoc(roomDocRef, { swiped: updatedSwiped });
    }

    setRestaurants(updatedRestaurants);
  };
  useEffect(() => {
    if (!room) navigation.navigate("Match");
  }, [room]);

  const checkAllMembersSwiped = (room) => {
    // Get the array of member IDs from the room object
    const memberIds = room.members;

    // Iterate over the places in the swiped object
    for (const placeId in room.swiped) {
      // Get the array of member IDs who have swiped on the current place
      const swipedMemberIds = room.swiped[placeId];

      // Check if all member IDs exist in the array of swiped member IDs
      const allMembersSwiped = memberIds.every((memberId) =>
        swipedMemberIds.includes(memberId)
      );

      if (allMembersSwiped) {
        return placeId; // Return the place ID if all members have swiped on this place
      }
    }

    return false; // Return false if no place satisfies the condition
  };

  useEffect(() => {
    const matched = checkAllMembersSwiped(room);
    if (matched) {
      const matchedRestaurant = room.restaurants.find(
        (restaurant) => restaurant.place_id === matched
      );
      navigation.navigate("Matched", { restaurant: matchedRestaurant });
    }
  }, [room.swiped]);
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
