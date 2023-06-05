import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Swipe from "../screens/Swipe";
import { createStackNavigator } from "@react-navigation/stack";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import FilterScreen from "../screens/FilterScreen";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const SwipeStack = () => {
  const theme = useTheme<Theme>();
  const { headerButtonText, buttonSecondaryText } = theme.colors;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: headerButtonText,
        headerShadowVisible: false,
        headerTitleStyle: {
          color: buttonSecondaryText,
        },
      }}
      initialRouteName="SwipeScreen"
    >
      <Stack.Screen name="SwipeScreen" component={Swipe} />
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
    </Stack.Navigator>
  );
};

export default SwipeStack;

const styles = StyleSheet.create({});
