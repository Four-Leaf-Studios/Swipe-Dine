import React, { useEffect, useState } from "react";
import Box from "./Box";
import Layout from "./Layout";
import Text from "./Text";
import Button from "./Button";
import { useRevenueCat } from "../lib/RevenueCatProvider";
import { ActivityIndicator } from "react-native";

// Represents one offering group with n SKU items to purchase
const OfferingGroup = ({ product, packagePurchased }) => {
  const { makePurchase, activeSubscriptions } = useRevenueCat();
  const [loading, setLoading] = useState(false);
  const subscribed = activeSubscriptions.includes(product.identifier);

  const handlePurchase = async () => {
    setLoading(true);
    await makePurchase(packagePurchased);
    setLoading(false);
  };

  return (
    <Box
      flex={1}
      justifyContent={loading ? "center" : "space-between"}
      alignItems={"center"}
      backgroundColor={"darkGray"}
      padding="l"
      gap={"l"}
      borderRadius={10}
      shadowColor={"black"}
      shadowOpacity={0.4}
      shadowRadius={4}
      shadowOffset={{ width: 0, height: 0 }}
    >
      {loading && <ActivityIndicator />}
      {!loading && (
        <>
          <Text variant="body" color="white">
            {product.title}
          </Text>
          <Text variant="body" color="white">
            {product.priceString}
          </Text>
          {!subscribed && (
            <Button variant="home" onPress={handlePurchase}>
              <Text variant="body" color="white">
                Subscribe
              </Text>
            </Button>
          )}

          {subscribed && (
            <Text variant="body" color="orangeDark">
              Subscribed
            </Text>
          )}
        </>
      )}
    </Box>
  );
};

export default OfferingGroup;
