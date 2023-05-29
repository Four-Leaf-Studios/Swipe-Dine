import { Image, StyleSheet, View } from "react-native";
import React from "react";
import Card from "./Card";
import Box from "./Box";
import Text from "./Text";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  title: string;
  subtitle: string;
  description: string;
};

const SwipeCard = ({ title, subtitle, description }: Props) => {
  return (
    <Card variant="swipe">
      <>
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          width="100%"
          padding="s"
          flex={1}
        >
          <Text variant="header" color="secondaryCardText">
            {title}
          </Text>
          <Text variant="subheader" color="secondaryCardText">
            {subtitle}
          </Text>
        </Box>
        <Box
          flexDirection="column"
          alignItems="center"
          width="100%"
          padding="s"
        >
          <Text variant="body" color="secondaryCardText">
            {description}
          </Text>
        </Box>
        <Image
          source={{
            uri: "https://scontent.ftpa1-2.fna.fbcdn.net/v/t39.30808-6/307314335_5655122674556643_1657747153723673069_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=l_BXiIM0IRAAX93YxJB&_nc_ht=scontent.ftpa1-2.fna&oh=00_AfDRNg-kNtQhQJYo4lQsqYqwzRkb5DnRPWmTi44oADvaVA&oe=647AE053",
          }}
          alt="Person"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            resizeMode: "cover",
            zIndex: -10,
          }}
        />
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(0,0,0,0)", "rgba(0,0,0,100)"]}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: -5,
          }}
        ></LinearGradient>
      </>
    </Card>
  );
};

export default SwipeCard;

const styles = StyleSheet.create({});
