import React, { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";

const useRestaurants = (filtersUpdated, setFiltersUpdated) => {
  const { filters } = useFilters();
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchRestaurants = async (filters) => {
      setLoading(true);

      const location = await getUserLocation();
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`,
        pageToken,
        filters
      );
      if (data.results) {
        if (filtersUpdated) {
          setRestaurants(data.results);
          setPageToken(null);
        } else {
          setRestaurants((list) => [...list, ...data.results]);
          setPageToken(data.nextPageToken);
        }
      } else {
        console.error(data.error);
      }
      setLoading(false);
    };

    if (restaurants.length === 0 || filtersUpdated) {
      const filterString = Object.entries(
        filtersUpdated ? filtersUpdated : filters || {}
      )
        .filter(([_, value]) => value === true)
        .map(([key]) => key.toLowerCase()) // Convert key to lowercase
        .join(" | ");

      console.log(filterString);
      fetchRestaurants(filterString);
      setFiltersUpdated(null);
    }
  }, [restaurants, filtersUpdated, filters]);

  return { restaurants, loading, setRestaurants };
};

export default useRestaurants;
