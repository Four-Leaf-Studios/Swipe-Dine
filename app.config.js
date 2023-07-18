import "dotenv/config";

const google_key = process.env.GOOGLE_PLACES_API_KEY_ONE;
const google_key_two = process.env.GOOGLE_PLACES_API_KEY_TWO;
const yelp_key = process.env.YELP_API_KEY;
const revenuecat_key = process.env.REVENUECAT_KEY;

export default {
  expo: {
    name: "Swipe & Dine",
    icon: "./assets/images/icon.png",
    version: "1.0.0",
    splash: {
      image: "./assets/images/Splash.png",
    },
    extra: {
      eas: {
        projectId: "532fcb21-d30b-44e1-ac28-683b56112119",
      },
      GOOGLE_PLACES_API_KEY_ONE: google_key,
      GOOGLE_PLACES_API_KEY_TWO: google_key_two,
      YELP_API_KEY: yelp_key,
      REVENUECAT_KEY: revenuecat_key,
    },
    ios: {
      bundleIdentifier: "com.michaelheinzman.swipeanddine",
      googleServicesFile: "./GoogleService-Info.plist",
      supportsTablet: true,
      buildNumber: "2",
    },
    android: {
      package: "com.michaelheinzman.swipeanddine",
      googleServicesFile: "./google-services.json",
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      [
        "expo-build-properties",
        {
          ios: {
            useFrameworks: "static",
          },
        },
      ],
    ],
    runtimeVersion: "1.0.0",
    updates: {
      url: "https://u.expo.dev/532fcb21-d30b-44e1-ac28-683b56112119",
    },
  },
  "react-native-google-mobile-ads": {
    android_app_id: "ca-app-pub-6650165506489456~2520889695",
    ios_app_id: "ca-app-pub-6650165506489456~2076967333",
  },
};
