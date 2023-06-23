import React, { useLayoutEffect, useState, useRef } from "react";
import Text from "../components/Text";
import Box from "../components/Box";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import OfferingGroup from "../components/OfferingGroup";
import Layout from "../components/Layout";
import UserPermissions from "../components/UserPermissions";
import useAuth, { UserInfo } from "../hooks/useAuth";
import { useRevenueCat } from "../lib/RevenueCatProvider";
import { normalize } from "react-native-elements";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const Shop = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray, orangeDark } = theme.colors;
  const { userProfile: user } = useAuth();
  const { offering } = useRevenueCat();
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: darkGray },
      headerRight: () => (
        <Box
          flex={1}
          width="100%"
          justifyContent={"center"}
          alignItems="flex-end"
          paddingRight="l"
        >
          <TouchableOpacity onPress={restore}>
            <Text variant="body" color="white" textAlign={"right"}>
              Restore
            </Text>
          </TouchableOpacity>
        </Box>
      ),
      headerLeft: () => (
        <Box
          flex={1}
          width="100%"
          justifyContent={"center"}
          alignItems="flex-start"
          paddingLeft="l"
        >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text variant="body" color="white" textAlign={"left"}>
              Close
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, []);

  const restore = async () => {
    try {
    } catch (e) {
      alert(e);
    }
  };

  const handleScroll = (event) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(
      scrollOffset / Dimensions.get("window").width
    );
    setActiveReviewIndex(currentPage);
  };

  const scrollToPage = (pageIndex) => {
    if (scrollViewRef.current) {
      const offsetX = pageIndex * Dimensions.get("window").width;
      scrollViewRef.current.scrollTo({ x: offsetX, animated: true });
    }
  };

  const scrollBack = () => {
    const prevPageIndex = activeReviewIndex - 1;
    if (prevPageIndex >= 0) {
      scrollToPage(prevPageIndex);
    }
  };

  const scrollForward = () => {
    const nextPageIndex = activeReviewIndex + 1;
    if (nextPageIndex < offering.availablePackages.length) {
      scrollToPage(nextPageIndex);
    }
  };

  return (
    <Layout variant="main">
      <Box width="100%" flex={1} gap={"l"} backgroundColor={"darkGray"}>
        <Box
          width="100%"
          flex={1}
          justifyContent={"flex-start"}
          alignItems="center"
        >
          <Box
            width="100%"
            height="25%"
            justifyContent={"space-around"}
            alignItems={"center"}
            flexDirection={"row"}
            padding="xl"
          >
            <Ionicons name="fast-food-outline" size={100} color={orangeDark} />
            <Text variant="header" color="white">
              Subscriptions
            </Text>
            <Ionicons name="fast-food-outline" size={100} color={orangeDark} />
          </Box>

          <Box
            position={"absolute"}
            bottom={0}
            left={0}
            width="100%"
            height="75%"
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            shadowColor={"black"}
            shadowRadius={8}
            shadowOffset={{ width: 0, height: -4 }}
            shadowOpacity={0.5}
            elevation={4}
            backgroundColor={"white"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            overflow="hidden"
          >
            <ScrollView
              ref={scrollViewRef}
              pagingEnabled
              nestedScrollEnabled
              horizontal
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              style={{ width: "100%", height: "100%" }}
              onScroll={handleScroll}
            >
              {offering.availablePackages.map((packagePurchased, index) => (
                <Box
                  key={index}
                  height="100%"
                  width={Dimensions.get("window").width}
                  justifyContent="center"
                  alignItems="center"
                  padding="l"
                >
                  <OfferingGroup
                    product={packagePurchased.product}
                    packagePurchased={packagePurchased}
                  />

                  <Box
                    height="100%"
                    width="100%"
                    position="absolute"
                    flexDirection={"row"}
                    justifyContent={
                      index > 0 && index < offering.availablePackages.length - 1
                        ? "space-between"
                        : index === 0
                        ? "flex-end"
                        : "flex-start"
                    }
                    alignItems="center"
                  >
                    {index > 0 && (
                      <Ionicons
                        name="ios-arrow-back-sharp"
                        size={50}
                        onPress={scrollBack}
                      />
                    )}
                    {index < offering.availablePackages.length - 1 && (
                      <Ionicons
                        name="ios-arrow-forward-sharp"
                        size={50}
                        onPress={scrollForward}
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Shop;
