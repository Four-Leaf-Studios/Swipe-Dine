import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useFilters from "../hooks/useFilters";
import Filters from "../components/Filters";
import {
  fetchNearbyPlacesFromFirestore,
  saveFilters,
} from "../lib/firebaseHelpers";
import MaskedViewCustom from "../components/MaskedViewCustom";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { getUserLocation } from "../utils/geolocation";

const Home = ({ navigation }) => {
  const { logout, user, userInfo } = useAuth();
  const { filters, setFilters } = useFilters();
  const theme = useTheme<Theme>();
  const { darkGray } = theme.colors;

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerStyle: { backgroundColor: darkGray },
      headerRight: () => (
        <Box paddingRight="l">
          <TouchableOpacity onPress={logout}>
            <Text variant="body" color="white">
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
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          width="100%"
          height="40%"
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor="darkGray"
          paddingBottom="xl"
        >
          <Text variant="subheader" color="white">
            Welcome to{" "}
            <Text variant="subheader" color="orangeDark">
              Swipe & Dine!
            </Text>
          </Text>
        </Box>
        <Box
          width="100%"
          position="absolute"
          bottom={0}
          height="60%"
          backgroundColor={"darkGray"}
        >
          <Box
            height="100%"
            justifyContent={"space-between"}
            alignItems="center"
            overflow="hidden"
            shadowColor={"white"}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            backgroundColor={"white"}
            shadowOpacity={0.25}
            elevation={4}
            shadowRadius={4}
            shadowOffset={{ width: 0, height: -4 }}
            padding="l"
          >
            <Box width="100%" flex={1} gap={"l"}>
              <Box padding="s">
                <Text variant="body" fontSize={20}>
                  What are you looking for?
                </Text>
              </Box>

              {filters && <Filters filters={filters} setFilters={setFilters} />}
            </Box>
            <Button
              variant="home"
              onPress={() => {
                saveFilters(null, filters, user.uid);
                navigation.navigate("Discover", {
                  room: null,
                  initialFilters: filters,
                });
              }}
            >
              <Text variant="body" color="buttonPrimaryText">
                Find Restaurants Nearby
              </Text>
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;

const styles = StyleSheet.create({});
