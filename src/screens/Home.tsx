import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import Button from "../components/Button";
import MaskedViewCustom from "../components/MaskedViewCustom";
import useAuth from "../hooks/useAuth";

const Home = ({ navigation }) => {
  const { logout } = useAuth();
  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerRight: () => (
        <Box paddingRight="l">
          <TouchableOpacity onPress={logout}>
            <Text variant="body" color="headerButtonText">
              Logout
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation]);
  return (
    <Layout variant="main">
      <Box
        width="100%"
        flex={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="s"
        gap="m"
      >
        <Box
          width="100%"
          flex={1}
          flexDirection="column"
          justifyContent="flex-start"
          alignItems="center"
          padding="s"
          gap="m"
        >
          <Button variant="home" onPress={() => navigation.navigate("Room")}>
            <MaskedViewCustom linearGradientVariant={"main"}>
              <Text variant="body" color="buttonPrimaryText">
                Create a Room
              </Text>
            </MaskedViewCustom>
          </Button>

          <Button
            variant="home"
            onPress={() => navigation.navigate("SwipeScreen")}
          >
            <Text variant="body" color="buttonPrimaryText">
              Search Restaurants
            </Text>
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({});
