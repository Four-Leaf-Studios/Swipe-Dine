import { Dimensions, FlatList } from "react-native";
import React from "react";
import Button from "./Button";
import Text from "./Text";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";

const Filters = ({ filters, setFilters }) => {
  const filterKeys = Object.keys(filters ? filters : {});

  return (
    <FlatList
      data={filterKeys} // Using the keys as the data source
      renderItem={({ item }) => (
        <Button
          key={item}
          variant={filters[item] ? "filterOn" : "filterOff"} // Accessing the value based on the current key
          onPress={() => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              [item]: !prevFilters[item], // Updating the value based on the current key
            }));
          }}
        >
          <Text
            variant="body"
            color={filters[item] ? "orangeDark" : "gray"}
            fontSize={{ longPhone: 16 }}
          >
            {item} {/* Using the current key as the filter name */}
          </Text>
        </Button>
      )}
      numColumns={3}
      // Setting the number of columns
      style={{ width: "100%" }}
    />
  );
};

export default Filters;
