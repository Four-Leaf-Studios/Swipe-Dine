import { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";
import useFilters from "./useFilters";

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
    const fetchRestaurants = async (filter) => {
      const location = await getUserLocation();
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`,
        pageToken,
        filter
      );
      if (data.results) {
        if (filtersUpdated) {
          setPrevFilters(filters);
          setRestaurants(data.results);
          setPageToken(null);
        } else {
          setRestaurants((list) => [...list, ...data.results]);
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
      fetchRestaurants(filterString);
    }
  }, [restaurants, filtersUpdated, filters]);

  // Update prevFilters when filters change
  useEffect(() => {
    setPrevFilters(filters);
  }, [filters]);
  return { restaurants, loading, setRestaurants, filters };
};

export default useRestaurants;
