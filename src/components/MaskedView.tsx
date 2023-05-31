import { StyleSheet, View } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import Box from "./Box";
import { ResponsiveValue } from "@shopify/restyle";

type Props = {
  children: ReactElement;
  linearGradientVariant: ResponsiveValue<
    "red" | "green" | "main" | "login" | "shadow" | "burger",
    {
      phone: number;
      longPhone: { width: number; height: number };
      tablet: number;
      largeTablet: number;
    }
  >;
};

const MaskedView = ({ children, linearGradientVariant }: Props) => {
  return (
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
          {children}
        </View>
      }
      style={[StyleSheet.absoluteFill]}
    >
      <LinearGradient variant={linearGradientVariant} />
      <Box
        width="100%"
        height="100%"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Box>
    </MaskedView>
  );
};

export default MaskedView;

const styles = StyleSheet.create({});
