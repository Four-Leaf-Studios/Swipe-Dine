import { Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import { ScrollView } from "react-native-gesture-handler";
import ProfileRestaurantItem from "../components/ProfileRestaurantItem";
import CustomImage from "../components/CustomImage";
import useAuth from "../hooks/useAuth";

const Profile = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray, gray } = theme.colors;
  const { userProfile, user } = useAuth();
  const { favoritedRestaurants: favorites, matchedRestaurants: matched } =
    userProfile;
  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerStyle: { backgroundColor: darkGray },
      headerTitleStyle: {
        color: "white",
      },
      headerRight: () => (
        <Box paddingRight="l" zIndex={"z-30"}>
          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Text variant="body" color="white">
              Settings
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation]);

  return (
    <Layout variant="white" gradient>
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
          flexDirection="column"
          justifyContent={"flex-start"}
          alignItems={"center"}
          backgroundColor="darkGray"
          paddingBottom="xl"
          padding="l"
          gap={"m"}
        >
          <CustomImage
            uri={
              user?.photoURL
                ? user?.photoURL
                : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            variant="profile"
          />
          <Text variant="subheader" color="white">
            {user?.displayName}
          </Text>
        </Box>
        <Box
          width="100%"
          position="absolute"
          height="60%"
          bottom={0}
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
            gap={"l"}
            paddingBottom="m"
            paddingTop="l"
          >
            <Box flex={1}>
              <Text variant="body" color="orangeDark">
                Your Favorites!
              </Text>
            </Box>
            <Box flex={5} width="100%">
              <ScrollView
                pagingEnabled
                nestedScrollEnabled
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={{ flex: 1, width: "100%" }}
              >
                {favorites?.map((id) => (
                  <ProfileRestaurantItem
                    key={id + "favorites"}
                    place_id={id}
                    favorites={favorites}
                  />
                ))}
              </ScrollView>
            </Box>

            <Box flex={1}>
              <Text variant="body" color="orangeDark">
                Previously Matched
              </Text>
            </Box>
            <Box flex={5} width="100%">
              <ScrollView
                pagingEnabled
                nestedScrollEnabled
                horizontal
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                style={{ flex: 1, width: "100%" }}
              >
                {matched?.map((id) => (
                  <ProfileRestaurantItem
                    key={id + "matched"}
                    place_id={id}
                    favorites={favorites}
                  />
                ))}
              </ScrollView>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Profile;
