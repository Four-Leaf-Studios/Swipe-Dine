import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeStack from "./homeStack";
import SwipeStack from "./swipeStack";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import RoomStack from "./roomStack";

const Tab = createMaterialBottomTabNavigator();

const UserStack = () => {
  const theme = useTheme<Theme>();
  const { mainBackground, buttonPrimaryBackground } = theme.colors;

  return (
    <NavigationContainer>
      <Tab.Navigator
        shifting
        sceneAnimationEnabled
        labeled={false}
        barStyle={{ backgroundColor: mainBackground }}
        sceneAnimationType="shifting"
        screenOptions={({ route }) => ({
          lazy: false,
          tabBarIcon: ({ focused }) => {
            let icon;
            const size = 24;
            if (route.name === "HomeStack") {
              icon = focused ? (
                <Ionicons
                  name={"md-home"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              ) : (
                <Ionicons
                  name={"md-home"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            } else if (route.name === "SwipeStack") {
              icon = focused ? (
                <Ionicons
                  name={"md-map"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              ) : (
                <Ionicons
                  name={"md-map"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            } else if (route.name === "RoomStack") {
              icon = focused ? (
                <Ionicons
                  name={"md-people"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              ) : (
                <Ionicons
                  name={"md-people"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            }
            if (!focused) return icon;
            return (
              <MaskedViewCustom linearGradientVariant={"main"}>
                {icon}
              </MaskedViewCustom>
            );
          },
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStack} />
        <Tab.Screen name="SwipeStack" component={SwipeStack} />
        <Tab.Screen name="RoomStack" component={RoomStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;

const styles = StyleSheet.create({});
