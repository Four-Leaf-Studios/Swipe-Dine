import { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";
import {
  checkDocumentExists,
  fetchNearbyPlacesFromFirestore,
} from "../lib/firebaseHelpers";
import { uploadRestaurantToFirestore } from "../lib/firebaseHelpers";

const useRestaurants = (room, initialFilters) => {
  const { filters } = useFilters(room, initialFilters);
  const [restaurants, setRestaurants] = useState<RestaurantDetails[] | null>(
    null
  );
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [googleOrFirebase, setGoogleOrFirebase] = useState(null);
  const [error, setError] = useState(null);

  const filterOutDuplicates = (restaurants) => {
    const uniqueRestaurants = [];
    const restaurantIds = new Set();

    // Loop through the restaurants and filter out duplicates based on the place_id
    for (const restaurant of restaurants) {
      if (!restaurantIds.has(restaurant.place_id)) {
        uniqueRestaurants.push(restaurant);
        restaurantIds.add(restaurant.place_id);
      }
    }

    return uniqueRestaurants;
  };

  useEffect(() => {
    const fetchNearbyRestaurants = async (filters) => {
      try {
        setLoading(true);
        const userLocation = await getUserLocation();
        const distance = 25;
        const firestoreResult = await fetchNearbyPlacesFromFirestore(
          userLocation,
          distance,
          filters,
          pageToken
        );

        // Check if firestore result is too small.
        if (
          firestoreResult?.results?.length < 40 &&
          (googleOrFirebase === "GOOGLE" || firstRender)
        ) {
          // Fetch Restuarants from Google Places API.
          const googleResult = await getGooglePlaces(
            userLocation,
            pageToken,
            filters
          );

          if (googleResult.results) {
            // Check if places are in firestore, if not upload them to firestore.
            googleResult.results = await Promise.all(
              googleResult.results.map(async (restaurant) => {
                // Check if restaurant exists in firestore.
                const restaurantFromFirestore = await checkDocumentExists(
                  restaurant.place_id
                );

                // If google restaurant exists in firestore then use firestore data.
                if (restaurantFromFirestore.exists) {
                  return restaurantFromFirestore.data;
                }

                // If google restaurant doesn't exist, upload it to firestore.
                if (!restaurantFromFirestore.exists) {
                  const { data } = await uploadRestaurantToFirestore(
                    restaurant,
                    filters,
                    true
                  );

                  return data;
                }
              })
            );
            setPageToken(googleResult.nextPageToken);
            setRestaurants(filterOutDuplicates(googleResult.results));
          }

          if (googleResult.error) {
            setError(googleResult.error);
          }

          setGoogleOrFirebase("GOOGLE");
        } else {
          if (firestoreResult.error) {
            setError(firestoreResult.error);
          }
          setGoogleOrFirebase("FIREBASE");
          setPageToken(firestoreResult.nextPageToken);
          setRestaurants(filterOutDuplicates(firestoreResult.results as any));
        }
      } catch (error) {
        setError(error);
      }

      setLoading(false);
    };

    if (restaurants?.length === 0) setRestaurants(null);
    if (!restaurants && (pageToken || firstRender)) {
      fetchNearbyRestaurants(filters);
      setFirstRender(false);
    }
  }, [restaurants]);

  return { restaurants, loading, setRestaurants, filters, error };
};

export default useRestaurants;
