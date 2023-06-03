import { TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Button from "../components/Button";
import Text from "../components/Text";
import useFilters from "../hooks/useFilters";

const FilterScreen = ({ navigation, route }) => {
  const { filters, setFilter } = useFilters();

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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text variant="body" color="headerButtonText">
              Save Filters
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation]);
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
        {Object.entries(filters).map(([key, value]) => (
          <Button
            key={key}
            variant={value ? "filterOn" : "filterOff"}
            onPress={() => setFilter(key, !value)}
          >
            <Text
              variant="body"
              color={value ? "buttonSecondaryText" : "buttonPrimaryText"}
            >
              {key} {value && "(selected)"}
            </Text>
          </Button>
        ))}
      </Box>
    </Layout>
  );
};

export default FilterScreen;
