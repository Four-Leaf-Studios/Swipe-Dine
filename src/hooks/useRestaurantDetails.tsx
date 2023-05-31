import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getRestaurantDetailsFromYelp } from "../api/yelp/yelp";
import { Restaurant, RestaurantDetails } from "../api/yelp/yelpTypes";
import { RestaurantDetails as RestaurantDetailsGoogle } from "../api/google/googleTypes";

const useRestaurantDetails = ({ id }: Restaurant) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetails>();

  useEffect(() => {
    const fetchRestaurantDetailsFromYelp = async () => {
      const data = await getRestaurantDetailsFromYelp(id);
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
