import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "./Button";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "./LinearGradient";
import Box from "./Box";
import Text from "./Text";
import MaskedViewCustom from "./MaskedViewCustom";

type Props = {
  type: string;
  handlePress: () => void;
};

const SwipeCardButton = ({ type, handlePress }: Props) => {
  const variants = {
    x: { variant: "red", value: "X" },
    heart: { variant: "green", value: "<3" },
  };

  const variant = variants[type];
  const gradientVariant = variant.variant;
  const value = variant.value;

  return (
    <Button variant="swipeScreenButton" label="X" onPress={handlePress}>
      <MaskedViewCustom linearGradientVariant={gradientVariant}>
        <Box
          width={60}
          height={60}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderWidth={3}
          borderRadius={999}
        >
          <Text variant="subheader">{value}</Text>
        </Box>
      </MaskedViewCustom>
    </Button>
  );
};

export default SwipeCardButton;

const styles = StyleSheet.create({});
