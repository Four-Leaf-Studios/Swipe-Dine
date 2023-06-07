import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Layout from "../components/Layout";

const Matched = ({ navigation, route }) => {
  const { restaurant } = route.params;
  return (
    <Layout variant="main">
      <Text>Matched</Text>
    </Layout>
  );
};

export default Matched;
