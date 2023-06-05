import { StyleSheet, TouchableOpacity } from "react-native";
import SwipeCard from "../components/SwipeCard";
import Box from "../components/Box";
import Text from "../components/Text";
import useRestaurants from "../hooks/useRestaurants";
import { useEffect, useState } from "react";
import { RestaurantDetails } from "../api/google/googleTypes";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";
import { useRecoilValue } from "recoil";
import { roomState } from "../atoms/atoms";
import useFilters from "../hooks/useFilters";

const Swipe = ({ navigation }) => {
  const { filters } = useFilters();
  const room = useRecoilValue(roomState);
  const { restaurants, loading, setRestaurants } = useRestaurants(filters);
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

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerRight: () =>
        room ? null : (
          <Box paddingRight="l">
            <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
              <Text variant="body" color="headerButtonText">
                Filters
              </Text>
            </TouchableOpacity>
          </Box>
        ),
    });
  }, [navigation]);

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
          {/* {loading ? (
            <AnimatedLogo variant="secondary" />
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
          )} */}
        </Box>
      </Box>
    </Layout>
  );
};

export default Swipe;

const styles = StyleSheet.create({});
