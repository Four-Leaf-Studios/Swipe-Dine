import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SwipeScreen from "../screens/Swipe";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createStackNavigator();

const userStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="SwipeScreen"
          options={{ headerShown: false }}
          component={SwipeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default userStack;

const styles = StyleSheet.create({});
