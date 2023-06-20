import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
import useFilters from "../hooks/useFilters";
import Filters from "../components/Filters";
import {
  saveFilters,
  updateUserProfileInFirestore,
} from "../lib/firebaseHelpers";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const Home = ({ navigation }) => {
  const { logout, user, userProfile } = useAuth();
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
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity onPress={() => navigation.navigate("Store")}>
            <Text variant="body" color="white">
              Shop
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation]);

  const searchRestaurants = async () => {
    if (userProfile.discovers === 0) {
      return;
    }

    saveFilters(null, filters, user.uid);
    await updateUserProfileInFirestore(user.uid, {
      ...userProfile,
      discovers: userProfile.discovers - 1,
    });

    navigation.navigate("Discover", {
      room: null,
      initialFilters: filters,
    });
  };

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
          height={{ phone: "25%", longPhone: "40%", tablet: "40%" }}
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor="darkGray"
          padding="s"
          paddingBottom={{ phone: "l", longPhone: "xl" }}
          gap={"xl"}
        >
          <Text variant={"header"} color="white">
            Welcome to{" "}
            <Text variant={"header"} color="orangeDark">
              Swipe & Dine!
            </Text>
          </Text>
        </Box>
        <Box
          width="100%"
          position="absolute"
          bottom={0}
          height={{ phone: "75%", longPhone: "60%", tablet: "60%" }}
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
            gap="s"
          >
            <Box width="100%" flex={1} gap={{ phone: "s", tablet: "m" }}>
              <Box padding="s" gap={{ phone: "s", tablet: "l" }}>
                <Text variant={"body"} fontWeight="600">
                  What are you looking for?
                </Text>
                <Text variant={"body"} fontWeight={"normal"}>
                  Better results when using one filter at a time if location
                  isn't in our database yet. (for now)
                </Text>
              </Box>

              {filters && <Filters filters={filters} setFilters={setFilters} />}
            </Box>
            <Button
              variant={userProfile.discovers === 0 ? "homeDisabled" : "home"}
              disabled={userProfile.discovers === 0}
              onPress={searchRestaurants}
            >
              <Box
                width="100%"
                height="100%"
                justifyContent={"center"}
                alignItems="center"
                flexDirection={"row"}
                gap={{ phone: "s", tablet: "m" }}
              >
                <Text
                  variant="body"
                  color={"buttonPrimaryText"}
                  fontWeight={"bold"}
                >
                  Find Restaurants Nearby{" "}
                </Text>
                <Box
                  padding={{ phone: "s", tablet: "m" }}
                  backgroundColor={
                    userProfile.discovers === 0 ? "error" : "darkGray"
                  }
                  borderRadius={999}
                >
                  <Text
                    variant="body"
                    color={"buttonPrimaryText"}
                    fontWeight={"bold"}
                    textAlign={"center"}
                  >
                    {userProfile?.discovers}
                  </Text>
                </Box>
              </Box>
            </Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
