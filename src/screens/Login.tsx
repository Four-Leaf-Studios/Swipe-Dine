import { Image, StyleSheet, TextInput } from "react-native";
import React from "react";
import { useForm } from "react-hook-form";
import Box from "../components/Box";
import Logo from "../components/Logo";
import Button from "../components/Button";
import StyledTextInput from "../components/StyledTextInput";
import Text from "../components/Text";
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
      <Box
        width="95%"
        flexGrow={0.5}
        padding="m"
        gap="s"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        borderRadius={10}
        borderColor="white"
        borderWidth={2}
        style={{
          backgroundColor: "rgba(0,0,0,.8)",
        }}
      >
        <Text variant="header" color="white">
          Foodr
        </Text>

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
      <Image
        source={{
          uri: "https://i.pinimg.com/originals/87/da/1e/87da1e47f484e30b95bfa2e0c6ecdd72.jpg",
        }}
        style={{
          width: "100%",
          height: "100%",
          top: 0,
          zIndex: -10,
          position: "absolute",
          resizeMode: "cover",
        }}
      />
    </>
  );
};

export default Login;

const styles = StyleSheet.create({});
