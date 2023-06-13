import { StyleSheet } from "react-native";
import React from "react";
import Home from "../screens/Home";
import { createStackNavigator } from "@react-navigation/stack";
import { Theme } from "../../theme";
import { useTheme } from "@shopify/restyle";
import FilterScreen from "../screens/FilterScreen";
import Discover from "../screens/Discover";
import Matched from "../screens/Matched";
import Shop from "../screens/Shop";

const Stack = createStackNavigator();
const HomeStack = () => {
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
      initialRouteName="Store"
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: null, gestureEnabled: false }}
      />
      <Stack.Screen
        name="Discover"
        component={Discover}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Filters"
        component={FilterScreen}
        options={{
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0],
                  }),
                },
              ],
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          }),
        }}
      />
      <Stack.Screen
        name="DiscoverMatched"
        component={Matched}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Store"
        component={Shop}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
