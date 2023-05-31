import { Image, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import SwipeCardButton from "./SwipeCardButton";
import LinearGradient from "./LinearGradient";
import { Restaurant } from "../api/yelp/yelpTypes";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";

interface Props {
  handleSwipe: (direction: string, index: number) => void;
  index: number;
  restaurant: RestaurantDetails;
}
const SwipeCard = ({ restaurant, handleSwipe, index }: Props) => {
  const {
    photos = [],
    name = "",
    rating,
    price_level,
    icon_mask_base_uri: image_url,
    vicinity,
  } = restaurant;

  // const {
  //   photos = [],
  //   name = "",
  //   image_url = "",
  //   price = "",
  //   rating = 0,
  // } = useRestaurantDetails(restaurant);
  const [currentPhoto, setCurrentPhoto] = useState(0);

  const handleSwipeLeft = () => handleSwipe("left", index);
  const handleSwipeRight = () => handleSwipe("right", index);
  const handleViewDetails = () => {};
  const handlePreviousPhoto = () => {
    setCurrentPhoto((prevPhoto) => {
      if (prevPhoto === 0) {
        return photos.length - 1;
      } else {
        return prevPhoto - 1;
      }
    });
  };

  const handleNextPhoto = () => {
    setCurrentPhoto((prevPhoto) => {
      if (prevPhoto === photos.length - 1) {
        return 0;
      } else {
        return prevPhoto + 1;
      }
    });
  };

  return (
    <Card variant="swipe">
      <>
        {/* Top Half */}
        <Box
          flex={2}
          position="relative"
          width="100%"
          zIndex="z-20"
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          {/* Photo List */}
          <Box
            width="100%"
            flex={0.01}
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            padding="l"
            gap="m"
          >
            {photos?.map((photo, index) => (
              <Box
                flex={1}
                backgroundColor={index === currentPhoto ? "white" : "gray"}
                height="100%"
              ></Box>
            ))}
          </Box>

          <Box
            width="100%"
            height="100%"
            position="absolute"
            flexDirection="row"
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
        </Box>

        {/* Description */}
        <Box
          position="relative"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-end"
          width="100%"
          paddingBottom="s"
          flex={1}
          zIndex="z-10"
        >
          <Box
            position="relative"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-end"
            width="100%"
            padding="l"
            flex={1}
            zIndex="z-10"
          >
            <Text variant="header" color="secondaryCardText">
              {name}
            </Text>
            <Text variant="subheader" color="secondaryCardText">
              Rating: {rating} / 5
            </Text>
            <Text variant="body" color="secondaryCardText">
              {vicinity}
            </Text>
          </Box>

          <Pressable
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              zIndex: 20,
            }}
            onPress={handleViewDetails}
          />
        </Box>
        <Image
          source={{
            uri:
              photos.length > 0
                ? getPhotoURL(photos[currentPhoto].photo_reference)
                : image_url,
          }}
          alt="Restaurant Photo"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            resizeMode: "cover",
            zIndex: -10,
          }}
        />

        {/* Swipe Card Buttons */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-around"
          gap="s"
          width="100%"
          padding="s"
          paddingBottom="l"
          zIndex="z-10"
        >
          <SwipeCardButton type="x" handlePress={handleSwipeLeft} />
          <SwipeCardButton type="heart" handlePress={handleSwipeRight} />
        </Box>
        <LinearGradient variant="shadow" />
      </>
    </Card>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({});
