import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import LoadingScreen from "./src/screens/Loading";
import SwipeScreen from "./src/screens/Swipe";
import LoginScreen from "./src/screens/Login";
import SignupScreen from "./src/screens/Signup";
import ForgotPassword from "./src/screens/ForgotPassword";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { AuthenticatedUserProvider } from "./src/hooks/useAuth";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const activeTheme = darkMode ? darkTheme : theme;

  return (
    <ThemeProvider theme={activeTheme}>
      <AuthenticatedUserProvider>
        <LoginScreen />
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
}
