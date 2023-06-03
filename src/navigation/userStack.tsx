import { StyleSheet } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SwipeScreen from "../screens/Swipe";
import { NavigationContainer } from "@react-navigation/native";
import Home from "../screens/Home";
import FilterScreen from "../screens/FilterScreen";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
const Stack = createStackNavigator();

const userStack = () => {
  const theme = useTheme<Theme>();
  const { headerButtonText } = theme.colors;
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: headerButtonText,
          headerTitleStyle: {
            color: "black",
          },
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SwipeScreen" component={SwipeScreen} />
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
    </NavigationContainer>
  );
};

export default userStack;

const styles = StyleSheet.create({});
