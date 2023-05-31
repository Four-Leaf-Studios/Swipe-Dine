import { StyleSheet, View } from "react-native";
import React from "react";
import Button from "./Button";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "./LinearGradient";
import Box from "./Box";
import Text from "./Text";

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
      <MaskedView
        maskElement={
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              {
                borderWidth: 3,
                borderRadius: 50,
                flex: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              },
            ]}
          >
            <Text variant="subheader">{value}</Text>
          </View>
        }
        style={[StyleSheet.absoluteFill]}
      >
        <LinearGradient variant={gradientVariant} />
        <Box
          width="100%"
          height="100%"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <Text variant="subheader">{value}</Text>
        </Box>
      </MaskedView>
    </Button>
  );
};

export default SwipeCardButton;

const styles = StyleSheet.create({});
