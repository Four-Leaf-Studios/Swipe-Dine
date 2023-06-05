import { TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Button from "../components/Button";
import Text from "../components/Text";
import Filters from "../components/Filters";
import { saveFilters } from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";
import useFilters from "../hooks/useFilters";
import { useRecoilState } from "recoil";
import { filtersState, roomFiltersState } from "../atoms/atoms";

const FilterScreen = ({ navigation, route }) => {
  const { room } = route.params;
  const { filters, setFilters } = useFilters(room);
  const { user } = useAuth();

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerLeft: () => (
        <Box paddingLeft="l">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="body" color="headerButtonText">
              Cancel
            </Text>
          </TouchableOpacity>
        </Box>
      ),
      headerRight: () => (
        <Box paddingRight="l">
          <TouchableOpacity
            onPress={() => {
              saveFilters(filters, user.uid);
              navigation.goBack();
            }}
          >
            <Text variant="body" color="headerButtonText">
              Save Filters
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation, filters]);

  return (
    <Layout variant="main">
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        flexWrap={"wrap"}
        gap="m"
        padding="l"
      >
        <Filters filters={filters} setFilters={setFilters} />
      </Box>
    </Layout>
  );
};

export default FilterScreen;
