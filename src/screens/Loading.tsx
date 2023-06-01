import React from "react";
import Logo from "../components/Logo";
import { Image, StyleSheet, View } from "react-native";
import Box from "../components/Box";
import LinearGradient from "../components/LinearGradient";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";
import MaskedView from "@react-native-masked-view/masked-view";
import SwipeCardButton from "../components/SwipeCardButton";
import Button from "../components/Button";

const Loading = () => {
  return (
    <>
      <LinearGradient variant="main">
        <Box
          width={200}
          height={100}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          backgroundColor="white"
          borderRadius={999}
          shadowColor="black"
          shadowOpacity={1}
          shadowRadius={50}
          overflow="hidden"
        >
          <MaskedViewCustom linearGradientVariant={"main"}>
            <Text variant="header">Foodr</Text>
          </MaskedViewCustom>
        </Box>
      </LinearGradient>
    </>
  );
};

export default Loading;
