import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import SwipeCardButton from "./SwipeCardButton";
import LinearGradient from "./LinearGradient";
type Props = {
  title: string;
  subtitle: string;
  description: string;
  photos: string[];
};

const SwipeCard = ({ title, subtitle, description, photos }: Props) => {
  const [currentPhoto, setCurrentPhoto] = useState(3);
  return (
    <Card variant="swipe">
      <>
        <Box
          width="100%"
          flex={0.01}
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          padding="l"
          gap="m"
          zIndex="z-10"
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
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="flex-end"
          width="100%"
          padding="s"
          paddingLeft="l"
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
          <SwipeCardButton type="x" />
          <SwipeCardButton type="heart" />
        </Box>
        <LinearGradient variant="shadow" />
      </>
    </Card>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({});
