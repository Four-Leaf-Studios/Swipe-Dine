import { StyleSheet, View } from "react-native";
import React from "react";
import SwipeCard from "../components/SwipeCard";
import Box from "../components/Box";
import Text from "../components/Text";

type Props = {};

const Swipe = (props: Props) => {
  return (
    <>
      <SwipeCard
        title="title"
        subtitle="subtitle"
        description={
          "Description Description Description Description Description Description Description"
        }
      />
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        gap="s"
        width="100%"
        padding="s"
        flex={1}
      >
        <Box
          borderRadius={100}
          backgroundColor="buttonPrimaryBackground"
          flexDirection="row"
          justifyContent="center"
          padding="s"
          flex={1}
        >
          <Text variant="header" color="secondaryCardText">
            X
          </Text>
        </Box>
        <Box
          borderRadius={100}
          backgroundColor="buttonPrimaryBackground"
          flexDirection="row"
          justifyContent="center"
          padding="s"
          flex={1}
        >
          <Text variant="header" color="secondaryCardText">
            X
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Swipe;

const styles = StyleSheet.create({});
