import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { UserInfo } from "../hooks/useAuth";
import { User } from "firebase/auth";

interface UserPermissionsProps {
  user: UserInfo;
}

// Display the user state based on permissions (previous purchases)
const UserPermissions = ({ user }: UserPermissionsProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>
        Free Features: {user?.subscriptions?.free ? "True" : "False"}
      </Text>
      <Text style={styles.text}>
        Standard Features: {user?.subscriptions?.standard ? "True" : "False"}
      </Text>
      <Text style={styles.text}>
        Premium Features: {user?.subscriptions?.premium ? "True" : "False"}
      </Text>
      <Text style={styles.text}>Discovers: {user?.discovers}</Text>
      <Text style={styles.text}>Room: {user?.rooms}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 20,
    color: "#4000A4",
    paddingVertical: 6,
  },
});

export default UserPermissions;
