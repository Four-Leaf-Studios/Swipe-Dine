import { StyleSheet } from "react-native";
import React from "react";
import Home from "../screens/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import FilterScreen from "../screens/FilterScreen";
import Discover from "../screens/Discover";
import Logo from "../components/Logo";
import Box from "../components/Box";
import Matched from "../screens/Matched";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";

const Stack = createStackNavigator();
const ProfileStack = () => {
  const theme = useTheme<Theme>();
  const { headerButtonText, buttonSecondaryText } = theme.colors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: headerButtonText,
        headerShadowVisible: false,
        headerTitleStyle: {
          color: buttonSecondaryText,
        },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ title: "Settings" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
