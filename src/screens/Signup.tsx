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
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
  });
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
        width={{ phone: "100%" }}
        flex={{ phone: 1, tablet: 0.6 }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="s"
        gap="m"
      >
        {/* Logo */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={1}
          backgroundColor="darkGray"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderRadius={10}
        >
          <Logo variant="header" />
        </Box>

        {/* Inputs */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={errors.email || errors.password ? 4 : 2}
          gap="s"
        >
          <StyledTextInput
            placeholder="Email"
            keyboardType={"email-address"}
            value={email}
            message={errors.email}
            variant="login"
            onChangeText={setEmail}
          />
          <StyledTextInput
            placeholder="Password"
            keyboardType={"visible-password"}
            value={password}
            message={errors.password}
            variant="login"
            onChangeText={setPassword}
            secure
          />
          <StyledTextInput
            placeholder="Confirm Password"
            keyboardType={"visible-password"}
            value={confirmPassword}
            message={errors.confirmPassword}
            variant="login"
            onChangeText={setConfirmPassword}
            secure
          />
        </Box>

        {/* Login Button */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={errors.email || errors.password ? 0.8 : 0.5}
        >
          <Button variant="login" label="Login" onPress={handleSubmit}>
            <MaskedViewCustom
              linearGradientVariant={
                errors.email || errors.password || errors.confirmPassword
                  ? "red"
                  : "green"
              }
            >
              <Text variant="header">Signup</Text>
            </MaskedViewCustom>
          </Button>
        </Box>

        {/* Apple Sign In */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
        >
          <AppleAuthenticationButton
            buttonType={AppleAuthenticationButtonType.SIGN_UP}
            buttonStyle={AppleAuthenticationButtonStyle.WHITE}
            cornerRadius={5}
            style={{
              flex: 1,
            }}
            onPress={async () => {}}
          />
        </Box>

        {/* Sign In Options other than Apple */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <SocialIcon type="facebook" light raised loading={loading.facebook} />
          <SocialIcon type="google" light raised loading={loading.google} />
        </Box>

        {/* Sign up button */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.3}
        >
          <Button
            variant="auth-nav"
            label="Already have an account?"
            onPress={() => {}}
          >
            <Text variant="body" color="white" fontWeight="bold">
              Already have an account?
            </Text>
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Signup;

const styles = StyleSheet.create({});
