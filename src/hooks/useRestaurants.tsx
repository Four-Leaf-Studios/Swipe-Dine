import React, { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getUserLocation } from "../utils/geolocation";

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const location = await getUserLocation();
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`,
        50000
      );
      if (data.result) {
        setRestaurants(data.result);
      } else {
        console.error(data.error);
      }
      setLoading(false);
    };

    fetchRestaurants();
  }, []);
  return { restaurants, loading, setRestaurants };
};

export default useRestaurants;
