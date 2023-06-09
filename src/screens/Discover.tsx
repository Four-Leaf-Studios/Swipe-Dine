import { StyleSheet, TouchableOpacity } from "react-native";
import SwipeCard from "../components/SwipeCard";
import Box from "../components/Box";
import Text from "../components/Text";
import useRestaurants from "../hooks/useRestaurants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RestaurantDetails } from "../api/google/googleTypes";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";

const Discover = ({ navigation, route }) => {
  const { room, initialFilters } = route.params;
  const { restaurants, loading, setRestaurants, filters } = useRestaurants(
    room,
    initialFilters
  );
  const [swipeLeftList, setSwipeLeftList] = useState<RestaurantDetails[]>([]);
  const [swipeRightList, setSwipeRightList] = useState<RestaurantDetails[]>([]);

  const handleSwipe = useCallback((direction: string, place_id: string) => {
    setRestaurants((prevRestaurants) => {
      const restaurantIndex = prevRestaurants.findIndex(
        (restaurant) => restaurant.place_id === place_id
      );

      if (restaurantIndex !== -1) {
        const updatedRestaurants = [...prevRestaurants];
        const restaurant = updatedRestaurants[restaurantIndex];

        // Remove the restaurant from the restaurants list
        updatedRestaurants.splice(restaurantIndex, 1);

        if (direction === "left") {
          setSwipeLeftList((prevList) => [...prevList, restaurant]);
        }
        if (direction === "right") {
          setSwipeRightList((prevList) => [...prevList, restaurant]);
          navigation.navigate("DiscoverMatched", {
            restaurant: restaurant,
            filters: filters,
          });
        }

        return updatedRestaurants;
      }

      return prevRestaurants;
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerRight: () =>
        room ? null : (
          <Box paddingRight="l">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Filters", {
                  room: null,
                  initialFilters: initialFilters,
                })
              }
            >
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
          {loading ? (
            <AnimatedLogo variant="secondary" />
          ) : restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <SwipeCard
                key={restaurant.place_id}
                restaurantPassed={restaurant}
                handleSwipe={handleSwipe}
                filters={filters ? filters : initialFilters}
                discover
              />
            ))
          ) : (
            <Text>No restaurants found.</Text>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Discover;
