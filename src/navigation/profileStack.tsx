import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import useAuth from "../hooks/useAuth";

const Stack = createStackNavigator();
const ProfileStack = () => {
  const { firstTime } = useAuth();
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
      initialRouteName={firstTime ? "Settings" : "Profile"}
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
