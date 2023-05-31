import { StyleSheet, ActivityIndicator } from "react-native";
import SwipeCard from "../components/SwipeCard";
import Box from "../components/Box";
import Text from "../components/Text";
import Logo from "../components/Logo";
import useRestaurants from "../hooks/useRestaurants";
import { useState } from "react";
import { RestaurantDetails } from "../api/google/googleTypes";

type Props = {};

const Swipe = (props: Props) => {
  const { restaurants, loading, setRestaurants } = useRestaurants();
  const [swipeLeftList, setSwipeLeftList] = useState<RestaurantDetails[]>([]);
  const [swipeRightList, setSwipeRightList] = useState<RestaurantDetails[]>([]);

  const handleSwipe = (direction: string, index: number) => {
    const updatedRestaurants = [...restaurants];
    const restaurant = updatedRestaurants[index];

    // Remove the restaurant from the restaurants list
    updatedRestaurants.splice(index, 1);

    if (direction === "left") {
      setSwipeLeftList((prevList) => [...prevList, restaurant]);
    }
    if (direction === "right") {
      setSwipeRightList((prevList) => [...prevList, restaurant]);
    }

    setRestaurants(updatedRestaurants);
  };

  return (
    <>
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap="s"
        paddingLeft="m"
        paddingRight="m"
        paddingBottom="s"
      >
        <Logo variant="subheader" />
        <Text variant="subheader" color="orangeDark">
          Filter
        </Text>
      </Box>

      <Box
        position="relative"
        width="100%"
        flex={10}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : restaurants.length > 0 ? (
          restaurants.map((restaurant, index) => (
            <SwipeCard
              key={restaurant.place_id}
              restaurant={restaurant}
              handleSwipe={handleSwipe}
              index={index}
            />
          ))
        ) : (
          <Text>No restaurants found.</Text>
        )}
      </Box>
    </>
  );
};

export default Swipe;

const styles = StyleSheet.create({});
