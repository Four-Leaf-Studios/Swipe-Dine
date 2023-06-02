import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import { ResponsiveValue } from "@shopify/restyle";
import Box from "./Box";

type Props = {
  children?: ReactElement<any>;
  variant: ResponsiveValue<any, any>;
};

const Layout = ({ children, variant }: Props) => {
  return (
    <LinearGradient variant={variant}>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </LinearGradient>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    marginTop: StatusBar.currentHeight,
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignitems: "center",
    maxHeight: "100%",
  },
});
