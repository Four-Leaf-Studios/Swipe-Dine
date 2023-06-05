import { FlatList, StyleSheet } from "react-native";
import React from "react";
import Button from "./Button";
import Text from "./Text";
import Box from "./Box";

const Filters = ({ filters, setFilters }) => {
  const filterKeys = Object.keys(filters ? filters : {}); // Accessing the keys of filters

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
          <Text variant="body" color={filters[item] ? "orangeDark" : "gray"}>
            {item} {/* Using the current key as the filter name */}
          </Text>
        </Button>
      )}
      // Setting the number of columns
      numColumns={3}
    />
  );
};

export default Filters;
