import { StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeStack from "./homeStack";
import MaskedViewCustom from "../components/MaskedViewCustom";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import MatchStack from "./matchStack";

const Tab = createMaterialBottomTabNavigator();

const UserStack = () => {
  const theme = useTheme<Theme>();
  const { mainBackground, buttonPrimaryBackground } = theme.colors;

  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneAnimationEnabled
        labeled={true}
        barStyle={{ backgroundColor: mainBackground }}
        sceneAnimationType="shifting"
        screenOptions={({ route }) => ({
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
            } else if (route.name === "RoomStack") {
              icon = focused ? (
                <Ionicons
                  name={"md-heart"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              ) : (
                <Ionicons
                  name={"md-heart"}
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
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{ title: "Home" }}
        />
        <Tab.Screen
          name="RoomStack"
          component={MatchStack}
          options={{ title: "Match" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;

const styles = StyleSheet.create({});
