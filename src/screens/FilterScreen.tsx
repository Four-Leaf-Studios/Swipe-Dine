import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Button from "../components/Button";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";
import useAuth from "../hooks/useAuth";
import Logo from "../components/Logo";

const FilterScreen = ({ navigation }) => {
  const { logout } = useAuth();
  return (
    <Layout variant="main">
      <Box width="100%" flex={1} flexDirection="column"></Box>
    </Layout>
  );
};

export default FilterScreen;
