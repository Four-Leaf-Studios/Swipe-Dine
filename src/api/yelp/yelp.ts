import axios from "axios";

const API_KEY =
  "6IYuglGLvhvd2s00Qp7Qpzkgy7GwHVLafR-alAwayyespz3koHiWoYDp7oln4zhcJ7hRhOxyaIESGiYrEoVS0TxT_xHlSWmUN7OJU00s05lRbLbq24Y8y6cGK4h2ZHYx";
const URL = "https://api.yelp.com/v3/businesses";
const URL_DETAILS = "https://api.yelp.com/v3/businesses/";
const Axios = axios.create({
  baseURL: URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
  params: {
    term: "restaurants",
    sort_by: "best_match",
    limit: 10,
  },
});

const getYelp = async (location: string) => {
  try {
    const response = await Axios.get("/search", {
      params: {
        location: location,
      },
    });
    return { result: response.data.businesses, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

const getRestaurantDetailsFromYelp = async (id: string) => {
  try {
    const response = await Axios.get(`/${id}`);
    return { result: response.data, error: null };
  } catch (error) {
    return { result: null, error: error.message };
  }
};

export { getYelp, getRestaurantDetailsFromYelp };
