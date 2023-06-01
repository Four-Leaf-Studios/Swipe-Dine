import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import Box from "./Box";
import { ResponsiveValue } from "@shopify/restyle";
import MaskedView from "@react-native-masked-view/masked-view";

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
  noBorder?: boolean;
  borderRadius?: number;
};

const MaskedViewCustom = ({
  children,
  linearGradientVariant,
  noBorder,
  borderRadius,
}: Props) => {
  return (
    <MaskedView
      maskElement={
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderWidth: noBorder ? 0 : 3,
              borderRadius: borderRadius ? borderRadius : 50,
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

export default MaskedViewCustom;

const styles = StyleSheet.create({});
