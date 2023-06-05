import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import SwipeCardButton from "./SwipeCardButton";
import LinearGradient from "./LinearGradient";
import { RestaurantDetails } from "../api/google/googleTypes";
import { getPhotoURL } from "../api/google/google";
import useRestaurantDetails from "../hooks/useRestaurantDetails";

interface Props {
  handleSwipe: (direction: string, index: number) => void;
  index: number;
  restaurant?: RestaurantDetails;
}

const SwipeCard = ({ restaurant, handleSwipe, index }: Props) => {
  const {
    photos = [],
    name = "",
    rating,
    price_level,
    icon_mask_base_uri: image_url,
    vicinity,
  } = useRestaurantDetails(restaurant?.place_id || "");
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [pan] = useState(new Animated.ValueXY());
  const [cardOpacity] = useState(new Animated.Value(1));

  const handleSwipeLeft = () => {
    Animated.timing(pan, {
      toValue: { x: -500, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => handleSwipe("left", index));
  };
  const handleViewDetails = () => {};
  const handleSwipeRight = () => {
    Animated.timing(pan, {
      toValue: { x: 500, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(() => handleSwipe("right", index));
  };

  const handlePanResponderMove = (_, gesture) => {
    pan.setValue({ x: gesture.dx, y: 0 });
  };

  const handlePanResponderRelease = (_, gesture) => {
    if (gesture.dx > 120) {
      handleSwipeRight();
    } else if (gesture.dx < -120) {
      handleSwipeLeft();
    } else {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  const cardStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }],
    opacity: cardOpacity,
  };

  const handlePreviousPhoto = () => {
    setCurrentPhoto((prevPhoto) => {
      if (prevPhoto === 0) {
        return 0;
      } else {
        return prevPhoto - 1;
      }
    });
  };

  const handleNextPhoto = () => {
    setCurrentPhoto((prevPhoto) => {
      if (prevPhoto === photos.length - 1) {
        return prevPhoto;
      } else {
        return prevPhoto + 1;
      }
    });
  };

  return (
    <Animated.View
      style={[styles.swipeCard, cardStyle]}
      {...panResponder.panHandlers}
    >
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
                  key={photo.photo_reference}
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
              <Text variant="subheader" color="white">
                {name}
              </Text>
              <Text variant="body" color="gray">
                Rating: {rating} / 5
              </Text>
              <Text variant="body" color="gray">
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
            style={styles.image}
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
          <LinearGradient variant="shadow" gradient />
        </>
      </Card>
    </Animated.View>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({
  swipeCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    zIndex: -10,
  },
});
