import { TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import SwipeCard from "../components/SwipeCard";
import Text from "../components/Text";
import { leaveRoomFirestore } from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const MatchDiscover = ({ navigation, route }) => {
  const { user } = useAuth();
  const { room, filters } = route.params;
  const [restaurants, setRestaurants] = useState(room?.restaurants);

  const handleSwipe = useCallback(async (direction, place_id) => {
    setRestaurants((prevRestaurants) => {
      const restaurantIndex = prevRestaurants.findIndex(
        (restaurant) => restaurant.place_id === place_id
      );

      if (restaurantIndex !== -1) {
        const updatedRestaurants = [...prevRestaurants];
        const restaurant = updatedRestaurants[restaurantIndex];
        // Remove the restaurant from the restaurants list
        updatedRestaurants.splice(restaurantIndex, 1);
        return updatedRestaurants;
      }

      return prevRestaurants;
    });

    if (direction === "left") {
      // Handle left swipe logic
    }
    if (direction === "right") {
      const roomDocRef = doc(collection(db, "rooms"), room.code);
      const roomSnapshot = await getDoc(roomDocRef);
      const roomData = roomSnapshot.data();

      if (roomData) {
        const updatedSwiped = { ...roomData.swiped };

        if (updatedSwiped.hasOwnProperty(place_id)) {
          // Place ID already exists in swiped, add user to existing array
          updatedSwiped[place_id] = [...updatedSwiped[place_id], user.uid];
        } else {
          // Place ID doesn't exist in swiped, create a new array with the user
          updatedSwiped[place_id] = [user.uid];
        }

        // Update the swiped field in the Firestore document
        await updateDoc(roomDocRef, { swiped: updatedSwiped });
      }
    }
  }, []);

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
      if (matchedRestaurant)
        navigation.navigate("Matched", {
          restaurant: matchedRestaurant,
          filters: filters,
        });
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
              key={restaurant.place_id}
              restaurantPassed={restaurant}
              handleSwipe={handleSwipe}
              filters={filters}
              discover
            />
          ))}
        </Box>
      </Box>
    </Layout>
  );
};

export default MatchDiscover;
