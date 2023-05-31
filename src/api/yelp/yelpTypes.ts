interface Category {
  alias: string;
  title: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Location {
  address1: string;
  address2?: string;
  address3?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  formatted_address: string;
}

interface Restaurant {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Category[];
  rating: number;
  coordinates: Coordinates;
  location: Location;
  phone: string;
  display_phone: string;
  distance: number;
  price?: string;
}

interface Review {
  id: string;
  rating: number;
  user: {
    id: string;
    profile_url: string;
    image_url: string;
    name: string;
  };
  text: string;
  time_created: string;
}

interface RestaurantDetails extends Restaurant {
  photos: string[];
  hours: {
    open: {
      is_overnight: boolean;
      start: string;
      end: string;
      day: number;
    }[];
    hours_type: string;
    is_open_now: boolean;
  }[];
  transactions: string[];
  reviews: Review[];
}

export { Restaurant, RestaurantDetails };
