import { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";
import firestore from "@react-native-firebase/firestore";
import {
  fetchNearbyPlacesFromFirestore,
  uploadRestaurantToFirestore,
} from "../lib/firebaseHelpers";

const useRestaurants = (room, initialFilters) => {
  const { filters } = useFilters(room, initialFilters);
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [distance, setDistance] = useState(50);
  const [initialList, setInitialList] = useState([]);
  const [firebase, setFirebase] = useState(false);
  const [noRestaurantsLeft, setNoRestaurantsLeft] = useState(false);
  const [initialRender, setInitialRender] = useState(true);
  let filtersUpdated = false;
  if (restaurants.length !== 0)
    filtersUpdated =
      JSON.stringify(prevFilters) === JSON.stringify(filters) ? false : true;

  useEffect(() => {
    const checkFirestoreAndUpdate = async (restaurant) => {
      if (!restaurant) return null;
      try {
        const docRef = firestore()
          .collection("places")
          .doc(restaurant.place_id);
        const doc = await docRef.get();

        if (doc.exists) {
          const updatedRestaurant = doc.data();
          return { ...restaurant, ...updatedRestaurant };
        } else {
          const { success, data, error } = await uploadRestaurantToFirestore(
            restaurant,
            filters,
            true
          );

          return data;
        }
      } catch (error) {
        console.error("Error fetching Firestore document:", error);
      }
      return restaurant;
    };

    const fetchAndUpdateRestaurants = async (filter) => {
      initialList && (await setDistance((distance) => distance + 10));
      const location = await getUserLocation();
      let fireData: any = await fetchNearbyPlacesFromFirestore(
        location,
        distance,
        filters,
        pageToken
      );
      console.log("FIREBASE", fireData.results.length, "Distance", distance);
      if (!(fireData.results.length > 50) && !firebase) {
        var googleData = await getGooglePlaces(
          `${location.latitude},${location.longitude}`,
          pageToken,
          filter
        );
        setFirebase(false);
      } else setFirebase(true);

      const data = googleData ? googleData : fireData;

      if (data.results) {
        let updatedRestaurants = fireData.results;
        if (googleData)
          updatedRestaurants = await Promise.all(
            data.results.map(checkFirestoreAndUpdate)
          );

        updatedRestaurants = updatedRestaurants.filter(
          (restaurant) => restaurant !== null
        );
        if (filtersUpdated) {
          setPrevFilters(filters);
          setRestaurants(updatedRestaurants);
          setInitialList(updatedRestaurants);
          setPageToken(null);
        } else {
          updatedRestaurants = updatedRestaurants.filter(
            (restaurant) =>
              !initialList.some((item) => item.place_id === restaurant.place_id)
          );

          if (
            (updatedRestaurants.length === 0 && firebase) ||
            (googleData && data.results.length < 20)
          ) {
            setNoRestaurantsLeft(true);
          }

          setInitialList((intitialList) => [
            ...initialList,
            ...updatedRestaurants,
          ]);
          setPageToken(data.nextPageToken);
          setRestaurants((list) => [...list, ...updatedRestaurants]);
        }
      } else {
        console.error(data.error);
        return null;
      }
    };

    if (
      (restaurants.length === 0 || filtersUpdated) &&
      filters &&
      !noRestaurantsLeft
    ) {
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
