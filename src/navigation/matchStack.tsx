import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import Room from "../screens/Room";
import Match from "../screens/Match";
import Discover from "../screens/Discover";

const Stack = createStackNavigator();

const MatchStack = () => {
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
        name="Match"
        component={Match}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Room"
        component={Room}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Matching"
        component={Discover}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default MatchStack;
