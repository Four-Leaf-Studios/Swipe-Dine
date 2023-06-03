import React, { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";

const useRestaurants = () => {
  const { getFiltersForParams } = useFilters();
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);

      const location = await getUserLocation();
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`,
        pageToken,
        getFiltersForParams()
      );
      if (data.results) {
        setRestaurants((list) => [...list, ...data.results]);
        setPageToken(data.nextPageToken);
      } else {
        console.error(data.error);
      }
      setLoading(false);
    };
    // if (restaurants.length === 0) fetchRestaurants();
  }, [restaurants]);
  return { restaurants, loading, setRestaurants };
};

export default useRestaurants;
