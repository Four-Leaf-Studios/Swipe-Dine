import { useEffect, useState } from "react";
import { RestaurantDetails as RestaurantDetailsGoogle } from "../api/google/googleTypes";
import { getRestaurantDetailsFromGooglePlaces } from "../api/google/google";
import {
  addFiltersToTypes,
  checkDocumentExists,
  uploadRestaurantDetailsToFirestore,
} from "../lib/firebaseHelpers";

const useRestaurantDetails = (
  id: string,
  discover = false,
  filters = {},
  viewDetails = true
) => {
  const [restaurant, setRestaurant] = useState<RestaurantDetailsGoogle>();
  const [loading, setLoading] = useState(false);

  const handleNewRestaurant = async (
    id,
    filters,
    setRestaurant,
    setLoading
  ) => {
    try {
      const data = await getRestaurantDetailsFromGooglePlaces(id);
      if (data.result) {
        setRestaurant(data.result);
        await updateExistingRestaurant(data.result, filters);
        setLoading(false);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleExistingRestaurant = async (
    existsResult,
    filters,
    setRestaurant,
    setLoading
  ) => {
    const existingRestaurant = existsResult.data;
    const newFilters = Object.entries(filters)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key);

    if (newFilters.length > 0) {
      await updateExistingRestaurant(existingRestaurant, filters);
    }

    setRestaurant(existingRestaurant);
    setLoading(false);
  };

  const updateExistingRestaurant = async (existingRestaurant, filters) => {
    existingRestaurant.types = addFiltersToTypes(
      existingRestaurant.types,
      filters
    );
    await uploadRestaurantDetailsToFirestore(existingRestaurant);
  };

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true);
      const existsResult = await checkDocumentExists(id);

      if (existsResult.exists) {
        await handleExistingRestaurant(
          existsResult,
          filters,
          setRestaurant,
          setLoading
        );
      } else {
        // If useRestaurantDetails was called in a discover page don't fetch details.
        !discover &&
          (await handleNewRestaurant(id, filters, setRestaurant, setLoading));
      }
    };

    if (!restaurant) {
      fetchRestaurantDetails();
    }
  }, [viewDetails]);

  return { restaurant: restaurant ? { ...restaurant } : null, loading };
};

export default useRestaurantDetails;
