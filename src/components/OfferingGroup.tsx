import React from "react";
import Box from "./Box";
import Layout from "./Layout";
import Text from "./Text";
import Button from "./Button";
import { useRevenueCat } from "../lib/RevenueCatProvider";

// Represents one offering group with n SKU items to purchase
const OfferingGroup = ({ product, packagePurchased }) => {
  const { makePurchase } = useRevenueCat();
  return (
    <Layout variant="main">
      <Box
        flex={1}
        justifyContent={"flex-start"}
        alignItems={"center"}
        padding="l"
        gap={"l"}
      >
        <Text variant="body">{product.title}</Text>
        <Text variant="body">{product.priceString}</Text>
        <Button variant="home" onPress={() => makePurchase(packagePurchased)}>
          <Text variant="body" color="white">
            Subscribe
          </Text>
        </Button>
      </Box>
    </Layout>
  );
};

export default OfferingGroup;
