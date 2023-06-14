import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Settings from "../screens/Settings";
const Stack = createStackNavigator();

const ProfileCreationStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateProfile">
        <Stack.Screen
          name="CreateProfile"
          options={{ headerShown: false }}
          component={Settings}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ProfileCreationStack;
