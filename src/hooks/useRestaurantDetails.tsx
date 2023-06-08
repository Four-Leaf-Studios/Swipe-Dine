import { StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { RestaurantDetails as RestaurantDetailsGoogle } from "../api/google/googleTypes";
import { getRestaurantDetailsFromGooglePlaces } from "../api/google/google";
import {
  checkDocumentExists,
  uploadRestaurantDetailsToFirestore,
} from "../lib/firebaseHelpers";

const useRestaurantDetails = (id: string, discover = false) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsGoogle>();
  
  useEffect(() => {
    const fetchRestaurantDetailsFromYelp = async () => {
      const existsResult = await checkDocumentExists(id);

      if (existsResult.exists) {
        setRestaurant(existsResult.data);
      } else {
        try {
          if (!discover) {
            const data = await getRestaurantDetailsFromGooglePlaces(id);
            if (data.result) {
              setRestaurant(data.result);
              await uploadRestaurantDetailsToFirestore(data.result);
            } else {
              console.error(data.error);
            }
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    if (!restaurant) {
      fetchRestaurantDetailsFromYelp();
    }
  }, []);

  return restaurant
    ? {
        ...restaurant,
      }
    : null;
};

export default useRestaurantDetails;

const styles = StyleSheet.create({});
