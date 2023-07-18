import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";
import { ScrollView } from "react-native-gesture-handler";
import { normalize } from "react-native-elements";
import firestore from "@react-native-firebase/firestore";
import useAuth from "../hooks/useAuth";
const Matched = ({ navigation, route }) => {
  const { user } = useAuth();
  const theme = useTheme<Theme>();
  const { darkGray, orangeDark } = theme.colors;
  const { restaurant: restaurantPassed, filters, room } = route.params;
  const { restaurant, loading } = useRestaurantDetails(
    restaurantPassed.place_id,
    false,
    filters
  );

  const unmatchInRoom = async (place_id) => {
    if (!place_id) return;
    try {
      const roomDocRef = firestore().collection("rooms").doc(room.code);
      const roomSnapshot = await roomDocRef.get();
      const roomData = roomSnapshot.data();
      if (roomData) {
        const updatedSwiped = { ...roomData.swiped };
        if (updatedSwiped[place_id]) {
          // Place ID exists in swiped, remove user from the array
          const updatedUsers = updatedSwiped[place_id]?.filter(
            (uid) => uid !== user.uid
          );

          // Update the swiped field in the Firestore document with the updatedUsers array
          await roomDocRef.update({
            swiped: {
              ...updatedSwiped,
              [place_id]: updatedUsers,
            },
          });
        }
      }
    } catch (error) {
      // Handle any errors that may occur during the unmatching process
      console.error("Error unmatching in room:", error);
    }
  };

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      title: restaurant?.name,
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity
            onPress={async () => {
              if (room) await unmatchInRoom(restaurant?.place_id);
              else navigation.goBack();
            }}
          >
            <Text variant="body" color="orangeDark">
              UNMATCH
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [restaurant]);

  if (!restaurant) return <ActivityIndicator />;

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
    const websiteUrl = restaurant?.url
      ? restaurant.url
      : "https://www.restaurantwebsite.com"; // Replace with the desired website URL

    Linking.openURL(websiteUrl).catch((error) => {
      console.error("Failed to open website:", error);
      // You can handle the error or display a message to the user if the website cannot be opened
    });
  };

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const currentPage = Math.round(scrollOffset / normalize(300)); // Adjust the value as needed
    setActiveReviewIndex(currentPage);
  };

  return (
    <Layout variant="main">
      <Box width="100%" flex={1}>
        <Box position="relative" width="100%" flex={0.55}>
          <Image
            source={{
              uri:
                restaurant.photos?.length > 0
                  ? restaurant.photos[0].photoUrl
                    ? restaurant.photos[0].photoUrl
                    : getPhotoURL(restaurant.photos[0].photo_reference)
                  : "https://www.eatthis.com/wp-content/uploads/sites/4/2020/06/chilis.jpg?quality=82&strip=1",
            }}
            style={{ width: "100%", height: "100%", resizeMode: "cover" }}
          />
          <Box
            position="absolute"
            width="100%"
            height="80%"
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
          height="55%"
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
            justifyContent={"center"}
            alignItems="center"
            paddingLeft="l"
            paddingRight="l"
            gap="l"
          >
            <Text variant="subheader" color="orangeDark" textAlign={"center"}>
              Reviews
            </Text>
          </Box>
          <Box
            width="100%"
            flex={1}
            justifyContent={"flex-start"}
            alignItems="center"
          >
            <ScrollView
              pagingEnabled
              nestedScrollEnabled
              horizontal
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              style={{ flex: 1, width: "100%" }}
              onScroll={handleScroll}
            >
              {restaurant?.reviews &&
                restaurant?.reviews?.map((review, index) => (
                  <Box
                    key={review.author_name}
                    width={Dimensions.get("window").width} // Adjust the value as needed
                    justifyContent="center"
                    alignItems="center"
                    padding="l"
                    gap="l"
                  >
                    <Image
                      source={{ uri: review.profile_photo_url }}
                      style={{ width: 40, height: 40 }}
                    />

                    <Text
                      variant="body"
                      textAlign={"center"}
                      color="buttonSecondaryText"
                      fontWeight="bold"
                    >
                      {review.author_name}
                    </Text>

                    <Text
                      variant="body"
                      textAlign={"center"}
                      color="buttonSecondaryText"
                    >
                      {review.text}
                    </Text>
                  </Box>
                ))}
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Matched;
