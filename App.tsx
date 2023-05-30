import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { ThemeProvider, createVariant, useTheme } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import Box from "./src/components/Box";
import LoadingScreen from "./src/screens/Loading";
import SwipeScreen from "./src/screens/Swipe";
import LoginScreen from "./src/screens/Login";
import LinearGradient from "./src/components/LinearGradient";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const activeTheme = darkMode ? darkTheme : theme;

  return (
    <ThemeProvider theme={activeTheme}>
      <SafeAreaView style={styles.container}>
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          maxWidth="100%"
          height="100%"
          padding="s"
        >
          <SwipeScreen />
        </Box>
      </SafeAreaView>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
});
