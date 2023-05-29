import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import Box from "./src/components/Box";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./src/screens/Loading";
import SwipeScreen from "./src/screens/Swipe";
import LoginScreen from "./src/screens/Login";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#FE8C00", "#FECC00", "#FFFC00"]}>
          <Box
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            maxWidth="100%"
            height="100%"
            padding="s"
          >
            <LoginScreen />
          </Box>
        </LinearGradient>
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
