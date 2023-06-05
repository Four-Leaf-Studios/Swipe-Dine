import React, { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";

const useRestaurants = (filters) => {
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [initialRender, setInitialRender] = useState(true);
  let filtersUpdated = false;
  if (restaurants.length > 0)
    filtersUpdated = prevFilters === filters ? false : true;
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

    // if ((restaurants.length === 0 || filtersUpdated) && filters) {
    //   if (filtersUpdated && initialRender) setInitialRender(false);
    //   else {
    //     const filterString = Object.entries(filters ? filters : {})
    //       .filter(([_, value]) => value === true)
    //       .map(([key]) => key.toLowerCase())
    //       .join(" | ");
    //     fetchRestaurants(filterString);
    //     console.log(
    //       "Filters : ",
    //       filters,
    //       "FILTERS UPDATED: ",
    //       filtersUpdated,
    //       "LENGTH:",
    //       restaurants.length
    //     );
    //   }
    // }
  }, [restaurants, filtersUpdated, filters]);

  return { restaurants, loading, setRestaurants };
};

export default useRestaurants;
