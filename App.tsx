import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import LoadingScreen from "./src/screens/Loading";
import SwipeScreen from "./src/screens/Swipe";
import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const activeTheme = darkMode ? darkTheme : theme;

  return (
    <ThemeProvider theme={activeTheme}>
      <LoadingScreen />
    </ThemeProvider>
  );
}
