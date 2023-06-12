import { Dimensions, Image, StyleSheet } from "react-native";
import React from "react";
import Box from "./Box";
import Text from "./Text";
import useRestaurantDetails from "../hooks/useRestaurantDetails";
import { Ionicons } from "@expo/vector-icons";
import {
  addRestaurantToFavoritesListInFirestore,
  removeRestaurantFromFavoritesInFirestore,
  removeRestaurantFromMatchedInFirestore,
} from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { TouchableOpacity } from "react-native-gesture-handler";

const ProfileRestaurantItem = ({ place_id, favorites }) => {
  const theme = useTheme<Theme>();
  const { orangeDark } = theme.colors;
  const { user } = useAuth();
  const { restaurant, loading } = useRestaurantDetails(place_id);
  const favorited = favorites?.includes(place_id);

  const handleFavoritedPressed = () => {
    if (favorited) removeRestaurantFromFavoritesInFirestore(place_id, user.uid);
    // remove from favorites

    addRestaurantToFavoritesListInFirestore(place_id, user.uid);
  };

  const handleDeletePressed = () => {
    removeRestaurantFromFavoritesInFirestore(place_id, user.uid);
    removeRestaurantFromMatchedInFirestore(place_id, user.uid);
  };
  return (
    <Box
      width={Dimensions.get("window").width}
      flex={1}
      paddingLeft="l"
      paddingRight="l"
    >
      <Box
        flex={1}
        shadowColor={"black"}
        shadowRadius={8}
        shadowOpacity={0.14}
        shadowOffset={{ width: 0, height: 4 }}
        backgroundColor={"white"}
        borderRadius={10}
      >
        <Box
          flex={1}
          width="100%"
          borderRadius={10}
          flexDirection={"row"}
          backgroundColor={"darkGray"}
          overflow="hidden"
        >
          <Box flex={1} height="100%">
            <Image
              source={{
                uri: restaurant?.photos[0].photoUrl,
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box
            flex={2}
            height="100%"
            flexDirection={"row"}
            justifyContent={"flex-start"}
            alignItems="flex-start"
            padding="s"
          >
            <Box
              flex={1.5}
              height="100%"
              justifyContent={"flex-start"}
              alignItems="flex-start"
              paddingBottom="s"
            >
              <Text variant="body" color="white">
                {restaurant?.name}
              </Text>
            </Box>

            <Box flex={0.5}></Box>
          </Box>
          <Box
            position={"absolute"}
            top={0}
            right={0}
            padding="s"
            height="100%"
            justifyContent={"space-between"}
            alignItems="center"
          >
            <Ionicons
              name="md-star"
              size={25}
              color={favorited ? orangeDark : "white"}
              onPress={handleFavoritedPressed}
            />
            <TouchableOpacity onPress={handleDeletePressed}>
              <Text variant="body" color="white">
                Delete
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileRestaurantItem;
