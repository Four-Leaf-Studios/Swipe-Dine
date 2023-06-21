import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import React, { ReactElement } from "react";
import LinearGradient from "./LinearGradient";
import { ResponsiveValue } from "@shopify/restyle";
type Props = {
  children?: ReactElement<any>;
  variant: ResponsiveValue<any, any>;
  gradient?: boolean;
};

const Layout = ({ children, variant, gradient }: Props) => {
  return (
    <LinearGradient variant={variant} gradient={gradient}>
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
    backgroundColor: "transparent",
  },
});
