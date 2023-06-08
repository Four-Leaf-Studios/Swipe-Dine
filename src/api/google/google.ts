import axios from "axios";
import { Dimensions } from "react-native";

const SECONDARY_API_KEY = "AIzaSyCrY8u4ZvjdQNOe2Z1U1hz0wr5G269vs9E";
const API_KEY = "AIzaSyBLB4ZE2E8SRTeZ2f9OtY1fXGJ8cdIlvro";
const URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const URL_DETAILS = "https://maps.googleapis.com/maps/api/place/details/json";

interface GooglePlacesParams {
  location: string;
  key: string;
  keyword: string;
  rankby: string;
  opennow: boolean;
  pagetoken?: string;
}

const getGooglePlaces = async (location, nextPageToken = null, keywords) => {
  try {
    const params: GooglePlacesParams = {
      location: location,
      key: SECONDARY_API_KEY,
      keyword: "restaurant | " + keywords,
      rankby: "distance",
      opennow: true,
    };

    if (nextPageToken) {
      params.pagetoken = nextPageToken;
    }

    const response = await axios.get(URL, { params });

    return {
      results: response.data.results,
      nextPageToken: response.data.next_page_token,
      error: null,
    };
  } catch (error) {
    return { results: null, nextPageToken: null, error: error.message };
  }
};

const getRestaurantDetailsFromGooglePlaces = async (placeId: string) => {
  try {
    const response = await axios.get(URL_DETAILS, {
      params: {
        key: SECONDARY_API_KEY,
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
  const { width, height } = Dimensions.get("window");
  const maxWidth = Math.round(width * 0.9);
  const maxHeight = Math.round(height * 0.9);
  const url = `${baseUrl}?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReference}&key=${SECONDARY_API_KEY}`;
  return url;
};

export { getGooglePlaces, getRestaurantDetailsFromGooglePlaces, getPhotoURL };
