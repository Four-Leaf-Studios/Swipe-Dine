import React, { useEffect, useState } from "react";
import Box from "./Box";
import Layout from "./Layout";
import Text from "./Text";
import Button from "./Button";
import { useRevenueCat } from "../lib/RevenueCatProvider";
import { ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Represents one offering group with n SKU items to purchase
const OfferingGroup = ({ product, packagePurchased }) => {
  const { makePurchase, activeSubscriptions, canUpgradeToPremium } =
    useRevenueCat();
  const [loading, setLoading] = useState(false);
  const subscribed = activeSubscriptions.includes(product.identifier);

  const handlePurchase = async () => {
    setLoading(true);
    await makePurchase(packagePurchased);
    setLoading(false);
  };

  const canUpgrade =
    activeSubscriptions.length === 0
      ? "UPGRADE"
      : !subscribed && product.title === "Standard Subscription" && "DOWNGRADE";
  return (
    <Box
      width="100%"
      height="100%"
      justifyContent={loading ? "center" : "space-between"}
      alignItems={"center"}
      padding="l"
      gap={"l"}
    >
      {loading && <ActivityIndicator />}
      {!loading && (
        <Box width="100%" height="100%" paddingLeft="xl" paddingRight="xl">
          <Box width="100%" gap="s">
            <Text variant="header" color="darkGray">
              {product.title.split(" ")[0].toUpperCase()}
            </Text>
            <Text variant="subheader" color="darkGray">
              {product.priceString}
            </Text>
          </Box>
          <Box width="100%" flex={1} justifyContent={"space-around"}>
            {packagePurchased.identifier === "Standard" && (
              <>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    15 MONTHLY DISCOVERS
                  </Text>
                </Box>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    10 MONTHLY ROOM CREATIONS
                  </Text>
                </Box>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    NO ADVERTISEMENTS
                  </Text>
                </Box>
              </>
            )}
            {packagePurchased.identifier === "Premium" && (
              <>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    30 MONTHLY DISCOVERS
                  </Text>
                </Box>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    20 MONTHLY ROOM CREATIONS
                  </Text>
                </Box>
                <Box
                  width="100%"
                  flex={1}
                  flexDirection={"row"}
                  justifyContent={"flex-start"}
                  alignItems="center"
                  gap="l"
                >
                  <Ionicons name="checkbox-outline" size={50} color="green" />
                  <Text variant="subheader" color="darkGray">
                    NO ADVERTISEMENTS
                  </Text>
                </Box>
              </>
            )}
          </Box>
          {!subscribed && (
            <Button variant="home" onPress={handlePurchase}>
              <Text variant="body" color="white">
                {canUpgrade}
              </Text>
            </Button>
          )}

          {subscribed && (
            <Text variant="body" color="orangeDark">
              Subscribed
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OfferingGroup;
