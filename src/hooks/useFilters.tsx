import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";

const useFilters = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    restaurant: true,
    ["Fast Food"]: false,
    ["Ice Cream"]: false,
    ["BBQ"]: true,
  });

  useEffect(() => {
    const fetchFiltersFromFirestore = async () => {};

    fetchFiltersFromFirestore();
  }, []);

  const getFiltersForParams = () => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);

    const paramsString = activeFilters.join(" | ");

    return paramsString;
  };
  const setFilter = (filter: string, value: boolean) =>
    setFilters((filters) => {
      return { ...filters, [filter]: value };
    });

  return { filters, getFiltersForParams, setFilter };
};

export default useFilters;

const styles = StyleSheet.create({});
