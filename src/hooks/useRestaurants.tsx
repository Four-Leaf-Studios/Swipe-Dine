import React, { useEffect, useState } from "react";
import { getGooglePlaces } from "../api/google/google";
import { Restaurant } from "../api/yelp/yelpTypes";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getYelp } from "../api/yelp/yelp";
import { getUserLocation } from "../utils/geolocation";

const useRestaurants = () => {
  const [restaurants, setRestaurants] = useState<RestaurantDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const location = await getUserLocation();
      console.log(location);
      const data = await getGooglePlaces(
        `${location.latitude},${location.longitude}`
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
