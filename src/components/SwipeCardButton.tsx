import { StyleSheet } from "react-native";
import React from "react";
import Button from "./Button";
import Box from "./Box";
import MaskedViewCustom from "./MaskedViewCustom";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

type Props = {
  type: string;
  handlePress: () => void;
};

const SwipeCardButton = ({ type, handlePress }: Props) => {
  const theme = useTheme<Theme>();
  const { buttonPrimaryBackground } = theme.colors;
  const variants = {
    ["md-close-outline"]: { variant: "red", value: type },
    ["md-heart-outline"]: { variant: "green", value: type },
    ["md-heart"]: { variant: "green", value: type },
    ["md-close"]: { variant: "red", value: type },
  };

  const variant = variants[type];
  const gradientVariant = variant.variant;
  const value = variant.value;

  return (
    <Button variant="swipeScreenButton" onPress={handlePress}>
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
          <Ionicons name={value} size={32} color={buttonPrimaryBackground} />
        </Box>
      </MaskedViewCustom>
    </Button>
  );
};

export default SwipeCardButton;

const styles = StyleSheet.create({});
