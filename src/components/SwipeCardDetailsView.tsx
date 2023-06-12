import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Box from "./Box";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const SwipeCardDetailsView = ({
  restaurant,
  photoURL,
  closeViewDetails,
  currentPhoto,
  handleNextPhoto,
  handlePreviousPhoto,
}) => {
  const theme = useTheme<Theme>();
  const { orangeDark } = theme.colors;
  return (
    <Box height="100%" width="100%" backgroundColor="white">
      <ScrollView
        scrollEnabled
        contentContainerStyle={{
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          position="absolute"
          zIndex={"z-30"}
          width="100%"
          height={"8%"}
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          padding="l"
          gap="m"
        >
          {restaurant.photos?.map((photo, index) => (
            <Box
              key={photo.photo_reference}
              flex={1}
              backgroundColor={index === currentPhoto ? "white" : "gray"}
              height="100%"
            ></Box>
          ))}
        </Box>
        <Box flex={1} position="relative" width="100%">
          <Box
            width="100%"
            height="100%"
            position="absolute"
            flexDirection="row"
            zIndex={"z-30"}
          >
            <Pressable
              style={{ flex: 1, height: "100%" }}
              onPress={handlePreviousPhoto}
            />
            <Pressable
              style={{ flex: 1, height: "100%" }}
              onPress={handleNextPhoto}
            />
          </Box>
          <Image
            source={{ uri: photoURL }}
            style={{ width: "100%", flex: 1 }}
          />
          <Box
            width="100%"
            height="100%"
            position="absolute"
            style={{ backgroundColor: "rgba(13,13,13,.5)" }}
          />
          <Box
            borderRadius={999}
            overflow="hidden"
            backgroundColor={"orangeDark"}
            position="absolute"
            bottom={-26}
            right={0}
            marginRight={"m"}
            zIndex={"z-30"}
          >
            <Ionicons
              name="md-arrow-down"
              color={"white"}
              size={35}
              style={{
                width: "100%",
                height: "100%",
                padding: 8,
              }}
              onPress={closeViewDetails}
            />
          </Box>
        </Box>
        <Box flex={1} width="100%"></Box>
      </ScrollView>
    </Box>
  );
};

export default SwipeCardDetailsView;

const styles = StyleSheet.create({});
