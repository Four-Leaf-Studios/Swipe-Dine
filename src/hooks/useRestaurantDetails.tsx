import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getRestaurantDetailsFromYelp } from "../api/yelp/yelp";
import { Restaurant, RestaurantDetails } from "../api/yelp/yelpTypes";
import { RestaurantDetails as RestaurantDetailsGoogle } from "../api/google/googleTypes";
import { getRestaurantDetailsFromGooglePlaces } from "../api/google/google";

const useRestaurantDetails = (id: string) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsGoogle>();

  useEffect(() => {
    const fetchRestaurantDetailsFromYelp = async () => {
      const data = await getRestaurantDetailsFromGooglePlaces(id);
      if (data.result) {
        setRestaurant(data.result);
      } else {
        console.error(data.error);
      }
    };

    fetchRestaurantDetailsFromYelp();
  }, []);

  return {
    ...restaurant,
  };
};

export default useRestaurantDetails;

const styles = StyleSheet.create({});
