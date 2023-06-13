import { StyleSheet, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useGlassfy } from "../lib/GlassfyProvider";
import Button from "../components/Button";
import Text from "../components/Text";
import Box from "../components/Box";
import { TouchableOpacity } from "react-native-gesture-handler";

const Shop = ({ navigation }) => {
  const { offerings, user, restorePermissions } = useGlassfy();

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

  console.log(offerings);
  return (
    <View>
      <Text>Shop</Text>
      {offerings.map((group) => (
        <>
          <Text key={group.offeringId} variant="body" color="darkGray">
            {group.offeringId}
          </Text>
          {group.skus.map((sku) => (
            <Text key={sku.skuId} variant="body" color="darkGray">
              {sku.skuId}
            </Text>
          ))}
        </>
      ))}
    </View>
  );
};

export default Shop;

const styles = StyleSheet.create({});
