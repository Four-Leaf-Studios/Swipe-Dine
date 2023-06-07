import { Image, Linking, TouchableOpacity } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import MaskedViewCustom from "../components/MaskedViewCustom";
import LinearGradient from "../components/LinearGradient";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";

const Matched = ({ navigation, route }) => {
  const theme = useTheme<Theme>();
  const { orangeDark, orange, orangeLight, darkGray } = theme.colors;
  const { restaurant } = route.params;

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

  return (
    <Layout variant="main">
      <Box width="100%" flex={1}>
        <Box position="absolute" right={0} top={0} padding="m" zIndex={"z-30"}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="md-star" size={35} color={darkGray} />
          </TouchableOpacity>
        </Box>
        <Box width="100%" flex={0.4}>
          <Image
            source={{
              uri:
                restaurant.photos?.length > 0
                  ? getPhotoURL(restaurant.photos[0].photo_reference)
                  : "https://www.eatthis.com/wp-content/uploads/sites/4/2020/06/chilis.jpg?quality=82&strip=1",
            }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
        </Box>

        <Box
          position={"absolute"}
          bottom={0}
          left={0}
          width="100%"
          height="65%"
          borderTopLeftRadius={30}
          borderTopRightRadius={30}
          shadowColor={"black"}
          shadowRadius={20}
          shadowOpacity={0.5}
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
            <TouchableOpacity onPress={handleWebsitePressed}>
              <Ionicons
                name="globe-outline"
                size={60}
                color={"white"}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: darkGray,
                  borderColor: darkGray,
                  overflow: "hidden",
                }}
              />
            </TouchableOpacity>
            <Text
              variant="body"
              color="orangeDark"
              textAlign={"center"}
              style={{ flex: 1 }}
            >
              {restaurant?.name
                ? restaurant.name
                : "HONG KONG CHINESE RESTAURANT"}
            </Text>

            <TouchableOpacity onPress={handleNavigatePressed}>
              <Ionicons
                name="md-car"
                size={60}
                color={"white"}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: darkGray,
                  overflow: "hidden",
                  borderColor: darkGray,
                }}
              />
            </TouchableOpacity>
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
