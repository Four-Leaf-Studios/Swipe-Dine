import { StyleSheet, TextInput } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import Box from "../components/Box";
import Logo from "../components/Logo";
import Button from "../components/Button";
import StyledTextInput from "../components/StyledTextInput";
type Props = {};

interface Inputs {
  email: string;
  password: string;
}

const Login = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <>
      <Logo variant="header" />

      <Box
        flex={0.5}
        padding="s"
        gap="s"
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <StyledTextInput
          placeholder="email"
          keyboardType="email-address"
          variant="login"
          register={register("email", { required: true })}
        />
        <StyledTextInput
          placeholder="password"
          keyboardType="visible-password"
          variant="login"
          register={register("password", { required: true })}
        />
        <Button label="Login" onPress={() => {}} variant="login" />
      </Box>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({});
