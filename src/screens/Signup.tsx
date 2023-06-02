import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Box from "../components/Box";
import MaskedViewCustom from "../components/MaskedViewCustom";
import StyledTextInput from "../components/StyledTextInput";
import Button from "../components/Button";
import Text from "../components/Text";
import Logo from "../components/Logo";
import Layout from "../components/Layout";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
} from "expo-apple-authentication";
import { SocialIcon } from "react-native-elements";

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
        width={{ phone: "100%", longPhone: "100%", tablet: "70%" }}
        height="100%"
        padding="xl"
        gap="l"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width="100%"
          height={{ phone: 60, longPhone: 60, tablet: 100 }}
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            width={{ phone: "50%", longPhone: "50%", tablet: "40%" }}
            height="100%"
            overflow="hidden"
            flexDirection="row"
            backgroundColor={{
              phone: "darkGray",
              longPhone: "darkGray",
              tablet: "darkGray",
            }}
            justifyContent="center"
            alignItems="center"
            borderRadius={10}
          >
            <Logo variant="header" />
          </Box>
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

        <TouchableOpacity onPress={() => {}}>
          <Text
            variant="body"
            color="white"
            fontWeight="bold"
            fontSize={{ phone: 20, tablet: 28 }}
          >
            Already have an account?
          </Text>
        </TouchableOpacity>

        <Box width="100%" height={{ phone: 60, longPhone: 60, tablet: 60 }}>
          <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={5}
            style={{
              flex: 1,
              height: "100%",
            }}
            onPress={async () => {}}
          />
        </Box>
        <Box
          width="100%"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <SocialIcon type="facebook" light raised loading={false} />
          <SocialIcon type="google" light raised loading={false} />
        </Box>
      </Box>
    </Layout>
  );
};

export default Signup;

const styles = StyleSheet.create({});