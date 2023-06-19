import React, { useLayoutEffect } from "react";
import Text from "../components/Text";
import Box from "../components/Box";
import { TouchableOpacity } from "react-native-gesture-handler";
import OfferingGroup from "../components/OfferingGroup";
import Layout from "../components/Layout";
import UserPermissions from "../components/UserPermissions";
import useAuth, { UserInfo } from "../hooks/useAuth";
import { useRevenueCat } from "../lib/RevenueCatProvider";

const Shop = ({ navigation }) => {
  const { userProfile: user } = useAuth();
  const { offering } = useRevenueCat();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Box
          flex={1}
          width="100%"
          justifyContent={"center"}
          alignItems="flex-end"
          paddingRight="l"
        >
          <TouchableOpacity onPress={restore}>
            <Text variant="body" color="orangeDark" textAlign={"right"}>
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
            <Text variant="body" color="orangeDark" textAlign={"left"}>
              Back
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
  return (
    <Layout variant="main">
      <Box width="100%" flex={1} gap={"l"} padding="l">
        {offering.availablePackages.map((packagePurchased) => (
          <OfferingGroup
            product={packagePurchased.product}
            packagePurchased={packagePurchased}
            key={packagePurchased.product.identifier}
          />
        ))}
      </Box>
    </Layout>
  );
};

export default Shop;
