import { TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Button from "../components/Button";
import Text from "../components/Text";
import Filters from "../components/Filters";
import { useRecoilState } from "recoil";
import { filtersState } from "../atoms/atoms";
import { saveFilters } from "../lib/firebaseHelpers";
import useAuth from "../hooks/useAuth";

const FilterScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [filters, setFilters] = useRecoilState(filtersState);
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
