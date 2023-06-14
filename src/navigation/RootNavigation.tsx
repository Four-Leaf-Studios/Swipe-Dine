import React from "react";
import UserStack from "./userStack";
import AuthStack from "./authStack";
import useAuth from "../hooks/useAuth";
import ProfileCreationStack from "./profileCreationStack";

export default function RootNavigation() {
  const { user, firstTime } = useAuth();

  return user ? (
    !firstTime ? (
      <UserStack />
    ) : (
      <ProfileCreationStack />
    )
  ) : (
    <AuthStack />
  );
}
