import { StyleSheet } from "react-native";
import React from "react";
import Button from "./Button";
import Text from "./Text";

const Filters = ({ filters, setFilters }) => {
  return (
    <>
      {filters &&
        Object.entries(filters)?.map(([key, value]) => (
          <Button
            key={key}
            variant={value ? "filterOn" : "filterOff"}
            onPress={() => {
              setFilters((filters) => {
                return { ...filters, [`${key}`]: !value };
              });
            }}
          >
            <Text
              variant="body"
              color={value ? "buttonSecondaryText" : "buttonPrimaryText"}
            >
              {key} {value && "(selected)"}
            </Text>
          </Button>
        ))}
    </>
  );
};

export default Filters;

const styles = StyleSheet.create({});
