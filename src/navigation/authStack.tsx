import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login";
import SignupScreen from "../screens/Signup";
import ForgotPassword from "../screens/ForgotPassword";
const Stack = createStackNavigator();

const authStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <Stack.Screen
          name="SignUp"
          options={{ headerShown: false }}
          component={SignupScreen}
        />
        <Stack.Screen
          name="ForgotPassword"
          options={{ headerShown: false }}
          component={ForgotPassword}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default authStack;

const styles = StyleSheet.create({});
