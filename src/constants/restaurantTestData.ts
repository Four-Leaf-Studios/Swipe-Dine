interface Restaurant {
  id: string;
  name: string;
  phone: string;
  description: string;
  location: Location;
  is_closed: boolean;
  is_claimed: boolean;
  categories: Category[];
  review_count: number;
  url: string;
  coordinates: GeolocationCoordinates;
  image_url: string;
  menu: Menu;
  price: string;
  rating: number;
  distance: number;
  transactions: string[];
  photos: string[];
  hours: Hours;
  display_phone: string;
}

interface Hours {}
interface Category {
  alias: string;
  title: string;
}
interface Menu {}
interface Location {
  city: string;
  country: string;
  address2: string;
  address3: string;
  state: string;
  address1: string;
  zip_code: string;
  display_address: string[];
  cross_streets: string[];
}

const yelpClientID = "ntUjp3WITlN3MVNcnToJ7Q";
const YELP_API_KEY =
  "6IYuglGLvhvd2s00Qp7Qpzkgy7GwHVLafR-alAwayyespz3koHiWoYDp7oln4zhcJ7hRhOxyaIESGiYrEoVS0TxT_xHlSWmUN7OJU00s05lRbLbq24Y8y6cGK4h2ZHYx";

const yelp_api_reference = {
  id: "y3iKFTk_sgIXCT6fNcBn_Q",
  alias: "chilis-tampa-7",
  name: "Chili's",
  image_url:
    "https://s3-media4.fl.yelpcdn.com/bphoto/Eq_jz4FBkSr3ojN4ENLjuw/o.jpg",
  is_claimed: true,
  is_closed: false,
  url: "https://www.yelp.com/biz/chilis-tampa-7?adjust_creative=ntUjp3WITlN3MVNcnToJ7Q&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_lookup&utm_source=ntUjp3WITlN3MVNcnToJ7Q",
  phone: "+18139721134",
  display_phone: "(813) 972-1134",
  review_count: 140,
  categories: [
    {
      alias: "bars",
      title: "Bars",
    },
    {
      alias: "tex-mex",
      title: "Tex-Mex",
    },
    {
      alias: "tradamerican",
      title: "American (Traditional)",
    },
  ],
  rating: 2,
  location: {
    address1: "2794 E Fowler Ave",
    address2: "",
    address3: "",
    city: "Tampa",
    zip_code: "33612",
    country: "US",
    state: "FL",
    display_address: ["2794 E Fowler Ave", "Tampa, FL 33612"],
    cross_streets: "",
  },
  coordinates: {
    latitude: 28.0546949,
    longitude: -82.4288961,
  },
  photos: [
    "https://s3-media4.fl.yelpcdn.com/bphoto/Eq_jz4FBkSr3ojN4ENLjuw/o.jpg",
    "https://s3-media4.fl.yelpcdn.com/bphoto/BfQnBnlGE_bFZS3rShOieg/o.jpg",
    "https://s3-media4.fl.yelpcdn.com/bphoto/Dvu5UpohvadnQx3SOME9DA/o.jpg",
  ],
  price: "$$",
  hours: [
    {
      open: [
        {
          is_overnight: false,
          start: "1100",
          end: "2300",
          day: 0,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "2300",
          day: 1,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "2300",
          day: 2,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "2300",
          day: 3,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "0000",
          day: 4,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "0000",
          day: 5,
        },
        {
          is_overnight: false,
          start: "1100",
          end: "2300",
          day: 6,
        },
      ],
      hours_type: "REGULAR",
      is_open_now: true,
    },
  ],
  transactions: ["pickup", "delivery"],
};
