import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useFilters from "../hooks/useFilters";
import Filters from "../components/Filters";
import { saveFilters } from "../lib/firebaseHelpers";

const Home = ({ navigation }) => {
  const { logout, user } = useAuth();
  const { filters, setFilters } = useFilters();

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerLeft: () => (
        <Box paddingLeft="l">
          <Text variant="body" color="headerButtonText">
            Swipe & Dine
          </Text>
        </Box>
      ),
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
          <Box
            flexGrow={0.5}
            width="100%"
            flexDirection={"column"}
            justifyContent={"space-between"}
            alignItems="center"
            borderColor="orangeDark"
            padding="m"
            borderWidth={3}
            borderRadius={20}
            gap={"m"}
          >
            <Box width="100%" flex={1} gap={"l"}>
              <Text variant="body" fontSize={20}>
                What are you looking for?
              </Text>
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
                Find Restaurants
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
