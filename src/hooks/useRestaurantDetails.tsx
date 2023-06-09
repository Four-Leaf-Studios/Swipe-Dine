import { useEffect, useState } from "react";
import { RestaurantDetails as RestaurantDetailsGoogle } from "../api/google/googleTypes";
import { getRestaurantDetailsFromGooglePlaces } from "../api/google/google";
import {
  addFiltersToTypes,
  checkDocumentExists,
  uploadRestaurantDetailsToFirestore,
} from "../lib/firebaseHelpers";

const useRestaurantDetails = (id: string, discover = false, filters) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsGoogle>();
  useEffect(() => {
    const fetchRestaurantDetailsFromYelp = async () => {
      const existsResult = await checkDocumentExists(id);

      if (existsResult.exists) {
        const existingRestaurant = existsResult.data;
        const existingFilters = existingRestaurant.types || [];

        // Extract filter keys with value true from the filters object
        const newFilters = Object.entries(filters)
          .filter(([key, value]) => value === true)
          .map(([key, value]) => key);

        // Check if filters are different and not already present in the types array
        const updatedFilters = [
          ...existingFilters,
          ...newFilters.filter(
            (filter) =>
              !existingFilters.includes(filter) &&
              !existingRestaurant.types.includes(filter)
          ),
        ];

        if (newFilters.length > 0) {
          existingRestaurant.types = addFiltersToTypes(
            existingRestaurant.types,
            filters
          );
          await uploadRestaurantDetailsToFirestore(existingRestaurant);
        }

        setRestaurant(existingRestaurant);
      } else {
        try {
          if (!discover) {
            const data = await getRestaurantDetailsFromGooglePlaces(id);
            if (data.result) {
              setRestaurant(data.result);
              // Update Firestore document with new filters
              data.result.types = addFiltersToTypes(data.result.types, filters);
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

  return restaurant ? { ...restaurant } : null;
};

export default useRestaurantDetails;
