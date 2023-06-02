import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import { ResponsiveValue } from "@shopify/restyle";
import Box from "./Box";

type Props = {
  children: ReactElement<any>;
  variant: ResponsiveValue<any, any>;
};

const Layout = ({ children, variant }: Props) => {
  return (
    <LinearGradient variant={variant}>
      <SafeAreaView style={styles.container}>
        <Box
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
          maxHeight="100%"
        >
          {children}
        </Box>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    marginTop: StatusBar.currentHeight,
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignitems: "center",
  },
});