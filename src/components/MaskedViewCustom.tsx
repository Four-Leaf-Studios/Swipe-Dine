import { StyleSheet } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import { ResponsiveValue } from "@shopify/restyle";
import MaskedView from "@react-native-masked-view/masked-view";

type Props = {
  children: ReactElement;
  linearGradientVariant: ResponsiveValue<
    "red" | "green" | "main" | "login" | "shadow" | "burger" | "error" | "gray",
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

interface MaskedViewProps {
  maskElement: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
}

const MaskedViewCustom: React.FC<Props> = ({
  children,
  linearGradientVariant,
}) => {
  return (
    <MaskedView maskElement={children}>
      <LinearGradient variant={linearGradientVariant} gradient />
      {children}
    </MaskedView>
  );
};

export default MaskedViewCustom;

const styles = StyleSheet.create({});
