import { Image, Linking, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";
import AnimatedLogo from "../components/AnimatedLogo";

const Matched = ({ navigation, route }) => {
  const theme = useTheme<Theme>();
  const { darkGray, orangeDark } = theme.colors;
  const { restaurant: restaurantPassed, filters } = route.params;
  const { restaurant: restaurantDetails, loading } = useRestaurantDetails(
    restaurantPassed.place_id,
    false,
    filters
  );
  const [restaurant, setRestaurant] = useState(
    restaurantDetails ? restaurantDetails : restaurantPassed
  );

  useEffect(() => {
    if (
      restaurantDetails &&
      JSON.stringify(restaurantDetails) !== JSON.stringify(restaurant)
    ) {
      setRestaurant(restaurantDetails);
    }
  }, [restaurantDetails]);
  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      title: restaurant.name,
    });
  }, []);
  //const restaurantDetails = useRestaurantDetails(restaurant.place_id);
  const handleNavigatePressed = () => {
    const address = restaurant?.vicinity
      ? restaurant.vicinity
      : "123 Main St, City, State"; // Replace with the desired address

    Linking.canOpenURL("maps://").then((supported) => {
      if (supported) {
        // Open the map application
        const mapAddress = `${encodeURIComponent(
          restaurant?.name
        )},${encodeURIComponent(address)}`;
        Linking.openURL(`maps://maps.apple.com/?daddr=${mapAddress}`);
      } else {
        console.log("Deep linking not supported on this device.");
        // You can provide an alternative action or UI for unsupported devices
      }
    });
  };

  const handleWebsitePressed = () => {
    const websiteUrl = restaurant?.website
      ? restaurant.website
      : "https://www.restaurantwebsite.com"; // Replace with the desired website URL

    Linking.openURL(websiteUrl).catch((error) => {
      console.error("Failed to open website:", error);
      // You can handle the error or display a message to the user if the website cannot be opened
    });
  };
  if (loading)
    return (
      <Layout variant="gray" gradient>
        <AnimatedLogo variant="secondary" />
      </Layout>
    );
  return (
    <Layout variant="main">
      <Box width="100%" flex={1}>
        <Box position="relative" width="100%" flex={0.6}>
          <Image
            source={{
              uri:
                restaurant.photos?.length > 0
                  ? restaurant.photos[0]?.photoUrl
                    ? restaurant.photos[0].photoUrl
                    : getPhotoURL(restaurant.photos[0].photo_reference)
                  : "https://www.eatthis.com/wp-content/uploads/sites/4/2020/06/chilis.jpg?quality=82&strip=1",
            }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
          <Box
            position="absolute"
            width="100%"
            height="90%"
            flexDirection="row"
            justifyContent={"space-between"}
            alignItems="flex-end"
            padding="l"
          >
            <TouchableOpacity onPress={handleWebsitePressed}>
              <Ionicons
                name="globe-outline"
                size={50}
                color={orangeDark}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  borderColor: "white",
                  overflow: "hidden",
                  shadowColor: "black",
                  shadowRadius: 8,
                  shadowOpacity: 0.5,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNavigatePressed}>
              <Ionicons
                name="md-car"
                size={50}
                color={orangeDark}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                  overflow: "hidden",
                  borderColor: "white",
                }}
              />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box
          position={"absolute"}
          bottom={0}
          left={0}
          width="100%"
          height="45%"
          borderTopLeftRadius={20}
          borderTopRightRadius={20}
          shadowColor={"black"}
          shadowRadius={8}
          shadowOffset={{ width: 0, height: -4 }}
          shadowOpacity={0.5}
          elevation={4}
          backgroundColor={"white"}
          flexDirection={"column"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          overflow="hidden"
        >
          <Box
            width="100%"
            borderTopLeftRadius={30}
            borderTopRightRadius={30}
            flexGrow={0.1}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems="center"
            paddingLeft="l"
            paddingRight="l"
            gap="l"
          >
            <Text
              variant="body"
              color="orangeDark"
              textAlign={"center"}
              style={{ flex: 1 }}
            >
              Reviews
            </Text>
          </Box>
          <Box
            width="100%"
            flex={1}
            justifyContent={"flex-start"}
            alignItems="center"
          ></Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Matched;
