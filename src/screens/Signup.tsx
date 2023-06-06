import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
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
import useAuth from "../hooks/useAuth";

const Signup = ({ navigation }) => {
  const { signUp } = useAuth();
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

  const handleSubmit = async () => {
    const result = await signUp(email, password);
    if (result?.email || result?.password)
      setErrors({
        email: result?.email,
        password: result?.password,
        confirmPassword: null,
      });
  };

  useEffect(() => {
    if (password !== confirmPassword)
      setErrors((errors) => {
        return { ...errors, confirmPassword: "Passwords do not match." };
      });
    else
      setErrors((errors) => {
        return { ...errors, confirmPassword: null };
      });
  }, [confirmPassword]);

  return (
    <Layout variant="main">
      <Box
        width={{ phone: "100%" }}
        flexGrow={{ phone: 1, tablet: 0.8, largeTablet: 0.6 }}
        flexDirection="column"
        justifyContent={{ phone: "flex-start", tablet: "center" }}
        alignItems="center"
        padding="l"
        gap="m"
      >
        {/* Logo */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={1}
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
          flex={
            errors.email || errors.password
              ? 7
              : { phone: 2.5, longPhone: 2, tablet: 1.5 }
          }
          maxHeight={{ phone: "100%", longPhone: "40%", tablet: "100%" }}
          gap={{ phone: "s", tablet: "m" }}
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
          minHeight={{ phone: 30, tablet: 60 }}
          maxHeight={{ phone: 80, tablet: 80 }}
        >
          <Button variant="login" onPress={handleSubmit}>
            <Text
              variant="header"
              color={
                errors.email || errors.confirmPassword || errors.password
                  ? "error"
                  : "success"
              }
            >
              Signup
            </Text>
          </Button>
        </Box>

        {/* Apple Sign In */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
          minHeight={{ phone: 40, tablet: 60 }}
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
          minHeight={20}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <TouchableOpacity>
            <SocialIcon
              type="facebook"
              light
              raised
              loading={loading.facebook}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <SocialIcon type="google" light raised loading={loading.google} />
          </TouchableOpacity>
        </Box>

        {/* Sign up button */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
        >
          <Button
            variant="auth-nav"
            onPress={() => navigation.navigate("Login")}
          >
            <Text
              variant="body"
              color="darkGray"
              fontWeight="bold"
              textAlign="center"
              style={{
                width: "100%",
              }}
            >
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
