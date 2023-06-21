interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface OpeningHoursPeriod {
  open: {
    day: number;
    time: string;
    hours?: number;
    minutes?: number;
  };
  close: {
    day: number;
    time: string;
    hours?: number;
    minutes?: number;
  };
}

interface OpeningHours {
  open_now: boolean;
  periods: OpeningHoursPeriod[];
  weekday_text: string[];
}

interface Photo {
  photoUrl?: string;
  height: number;
  width: number;
  html_attributions: string[];
  photo_reference: string;
}

interface Review {
  author_name: string;
  author_url: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface RestaurantDetails {
  address_components: AddressComponent[];
  adr_address: string;
  business_status?: string;
  formatted_address: string;
  formatted_phone_number?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  name: string;
  opening_hours?: OpeningHours;
  permanently_closed?: boolean;
  photos: Photo[];
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  price_level?: number;
  rating?: number;
  reference?: string;
  reviews?: Review[];
  types: string[];
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  vicinity: string;
  website?: string;
  ad?: boolean;
}

export { RestaurantDetails };
