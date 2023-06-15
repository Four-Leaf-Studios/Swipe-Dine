import { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";
import firestore from "@react-native-firebase/firestore";

const useRestaurants = (room, initialFilters) => {
  const { filters } = useFilters(room, initialFilters);
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [initialRender, setInitialRender] = useState(true);
  let filtersUpdated = false;
  if (restaurants.length !== 0)
    filtersUpdated =
      JSON.stringify(prevFilters) === JSON.stringify(filters) ? false : true;

  useEffect(() => {
    const checkFirestoreAndUpdate = async (restaurant) => {
      try {
        const docRef = firestore().doc(`places/${restaurant.place_id}`);
        const docSnapshot = await docRef.get();
        if (docSnapshot.exists) {
          const updatedRestaurant = docSnapshot.data();
          return { ...restaurant, ...updatedRestaurant };
        }
      } catch (error) {
        console.error("Error fetching Firestore document:", error);
      }
      return restaurant;
    };

    const fetchAndUpdateRestaurants = async (filter) => {
      const location = await getUserLocation();
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`,
        pageToken,
        filter
      );
      if (data.results) {
        const updatedRestaurants = await Promise.all(
          data.results.map(checkFirestoreAndUpdate)
        );
        if (filtersUpdated) {
          setPrevFilters(filters);
          setRestaurants(updatedRestaurants);
          setPageToken(null);
        } else {
          setRestaurants((list) => [...list, ...updatedRestaurants]);
          setPageToken(data.nextPageToken);
        }
      } else {
        console.error(data.error);
        return null;
      }
    };

    if ((restaurants.length === 0 || filtersUpdated) && filters) {
      const filterString = Object.entries(filters ? filters : {})
        .filter(([_, value]) => value === true)
        .map(([key]) => key.toLowerCase())
        .join(" | ");

      fetchAndUpdateRestaurants(filterString);
    }
  }, [restaurants, filtersUpdated, filters]);

  // Update prevFilters when filters change
  useEffect(() => {
    setPrevFilters(filters);
  }, [filters]);

  return { restaurants, loading, setRestaurants, filters };
};

export default useRestaurants;
