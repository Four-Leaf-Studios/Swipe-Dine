import { StyleSheet, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useGlassfy } from "../lib/GlassfyProvider";
import Button from "../components/Button";
import Text from "../components/Text";
import Box from "../components/Box";
import { TouchableOpacity } from "react-native-gesture-handler";
import OfferingGroup from "../components/OfferingGroup";
import Layout from "../components/Layout";
import UserPermissions from "../components/UserPermissions";
import useAuth, { UserInfo } from "../hooks/useAuth";

const Shop = ({ navigation }) => {
  const { userProfile: user } = useAuth();
  const { offerings, restorePermissions } = useGlassfy();

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
      const permissions = await restorePermissions!();
      console.log(permissions);
    } catch (e) {
      alert(e);
    }
  };
  return (
    <Layout variant="main">
      <Box width="100%" flex={1}>
        {offerings.map((group) => (
          <OfferingGroup group={group} key={group.offeringId} />
        ))}

        <UserPermissions user={user as UserInfo} />
      </Box>
    </Layout>
  );
};

export default Shop;
