import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeStack from "./homeStack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import MatchStack from "./matchStack";
import useAuth from "../hooks/useAuth";
import Box from "../components/Box";
import ProfileStack from "./profileStack";

const Tab = createMaterialBottomTabNavigator();

const UserStack = () => {
  const { firstTime } = useAuth();
  const theme = useTheme<Theme>();
  const { mainBackground, buttonPrimaryBackground, orangeDark } = theme.colors;

  return (
    <NavigationContainer>
      <Tab.Navigator
        sceneAnimationEnabled
        labeled={true}
        barStyle={{ backgroundColor: mainBackground }}
        sceneAnimationType="shifting"
        initialRouteName={firstTime ? "ProfileStack" : "Home"}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let icon;
            const size = 24;
            if (route.name === "HomeStack") {
              icon = focused ? (
                <Ionicons name={"md-home"} size={size} color={orangeDark} />
              ) : (
                <Ionicons
                  name={"md-home"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            } else if (route.name === "RoomStack") {
              icon = focused ? (
                <Ionicons name={"md-heart"} size={size} color={orangeDark} />
              ) : (
                <Ionicons
                  name={"md-heart"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            } else if (route.name == "ProfileStack") {
              icon = focused ? (
                <Ionicons name={"md-person"} size={size} color={orangeDark} />
              ) : (
                <Ionicons
                  name={"md-person"}
                  size={size}
                  color={buttonPrimaryBackground}
                />
              );
            }
            if (!focused) return icon;
            return <Box>{icon}</Box>;
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
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            title: "Profile",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default UserStack;
