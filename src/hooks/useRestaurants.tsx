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
import useAuth from "./useAuth";

const useRestaurants = (room, initialFilters) => {
  const { userProfile } = useAuth();
  const { filters } = useFilters(room, initialFilters);
  const [restaurants, setRestaurants] = useState<RestaurantDetails[] | null>(
    null
  );
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [googleOrFirebase, setGoogleOrFirebase] = useState(null);

  useEffect(() => {
    const fetchNearbyRestaurants = async (filters) => {
      try {
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

          setGoogleOrFirebase("GOOGLE");
          setPageToken(googleResult.nextPageToken);
          setRestaurants(googleResult.results);
        } else {
          setGoogleOrFirebase("FIREBASE");
          setPageToken(firestoreResult.nextPageToken);
          setRestaurants(firestoreResult.results as RestaurantDetails[]);
        }
      } catch (error) {}
    };

    if (restaurants?.length === 0) setRestaurants(null);
    if (!restaurants && (pageToken || firstRender)) {
      setLoading(true);
      fetchNearbyRestaurants(filters);
      setLoading(false);
      setFirstRender(false);
    }
  }, [restaurants]);

  return { restaurants, loading, setRestaurants, filters };
};

export default useRestaurants;
