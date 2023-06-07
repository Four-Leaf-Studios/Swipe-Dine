import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import Room from "../screens/Room";
import Match from "../screens/Match";
import FilterScreen from "../screens/FilterScreen";
import MatchDiscover from "../screens/MatchDiscover";
import Matched from "../screens/Matched";

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
        name="MatchDiscover"
        component={MatchDiscover}
        options={{ gestureEnabled: false, title: "Room Discover" }}
      />
      <Stack.Screen
        name="RoomFilters"
        component={FilterScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Matched"
        component={Matched}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default MatchStack;
