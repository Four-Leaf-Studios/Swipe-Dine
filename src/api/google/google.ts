import axios from "axios";

const API_KEY = "AIzaSyBLB4ZE2E8SRTeZ2f9OtY1fXGJ8cdIlvro";
const URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const URL_DETAILS = "https://maps.googleapis.com/maps/api/place/details/json";
const Axios = axios.create({
  baseURL: URL,
  params: {
    key: API_KEY,
    type: "restaurant",
    rankby: "distance",
  },
});

const getGooglePlaces = async (location: string) => {
  try {
    const response = await axios.get(URL, {
      params: {
        location: location,
        type: "restaurant",
        rankby: "distance",
        key: API_KEY,
      },
    });

    return { result: response.data.results, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

const getRestaurantDetailsFromGooglePlaces = async (placeId: string) => {
  try {
    const response = await axios.get(URL_DETAILS, {
      params: {
        key: API_KEY,
        place_id: placeId,
      },
    });
    return { result: response.data.result, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

const getPhotoURL = (photoReference) => {
  const baseUrl = "https://maps.googleapis.com/maps/api/place/photo";
  const maxWidth = 400;
  const url = `${baseUrl}?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
  return url;
};

export { getGooglePlaces, getRestaurantDetailsFromGooglePlaces, getPhotoURL };
