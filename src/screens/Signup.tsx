import { StyleSheet } from "react-native";
import React, { useState } from "react";
import LinearGradient from "../components/LinearGradient";
import Box from "../components/Box";
import MaskedViewCustom from "../components/MaskedViewCustom";
import StyledTextInput from "../components/StyledTextInput";
import Button from "../components/Button";
import Text from "../components/Text";
import Logo from "../components/Logo";
import Layout from "../components/Layout";

type Props = {};

const Signup = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirmPassword: null,
  });
  const handleSubmit = () => {
    if (errors.email && errors.password)
      setErrors({ email: null, password: null, confirmPassword: null });
    else
      setErrors({
        email: "Please enter an email.",
        password: "Please enter a password.",
        confirmPassword: "Not the same as your password.",
      });
  };
  return (
    <Layout variant="main">
      <Box
        width={{ phone: "100%", longPhone: "80%", tablet: "70%" }}
        flexGrow={0}
        padding="xl"
        gap="l"
        flexDirection="column"
        justifyContent={{
          phone: "center",
          longPhone: "center",
          tablet: "center",
        }}
        alignItems="center"
        shadowColor="black"
        shadowRadius={10}
        shadowOpacity={0.15}
      >
        <Box
          width="100%"
          height={{ phone: 60, longPhone: 80, tablet: 100 }}
          overflow="hidden"
          flexDirection="row"
          backgroundColor="white"
          justifyContent="center"
          alignItems="center"
          borderRadius={10}
        >
          <Logo variant="header" />
        </Box>
        <Box
          width="100%"
          flexDirection="column"
          justifyContent="center"
          flexShrink={!password && 1}
          flexGrow={password && 1}
          gap="l"
          alignItems="center"
        >
          <StyledTextInput
            placeholder="email"
            keyboardType="email-address"
            variant="login"
            message={errors.email}
            value={email}
            onChangeText={setEmail}
          />
          <StyledTextInput
            placeholder="password"
            keyboardType="visible-password"
            variant="login"
            message={errors.password}
            value={password}
            onChangeText={setPassword}
            secure
          />
          {password && (
            <StyledTextInput
              placeholder="confirm password"
              keyboardType="visible-password"
              variant="login"
              message={errors.confirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure
            />
          )}
        </Box>

        <Button label="Login" onPress={handleSubmit} variant="login">
          <MaskedViewCustom
            linearGradientVariant={
              errors.email || errors.password || errors.confirmPassword
                ? "red"
                : "green"
            }
            noBorder
          >
            <Text variant="subheader">Signup</Text>
          </MaskedViewCustom>
        </Button>
      </Box>
    </Layout>
  );
};

export default Signup;

const styles = StyleSheet.create({});
