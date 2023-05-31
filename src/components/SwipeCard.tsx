import { Image, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import SwipeCardButton from "./SwipeCardButton";
import LinearGradient from "./LinearGradient";
import Button from "./Button";
type Props = {
  title: string;
  subtitle: string;
  description: string;
  photos: string[];
};

const SwipeCard = ({ title, subtitle, description, photos }: Props) => {
  const [currentPhoto, setCurrentPhoto] = useState(3);

  const handleSwipeLeft = () => {};
  const handleSwipeRight = () => {};
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
              {title}
            </Text>
            <Text variant="subheader" color="secondaryCardText">
              {subtitle}
            </Text>
            <Text variant="body" color="secondaryCardText">
              {description}
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
            uri: photos[currentPhoto],
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
