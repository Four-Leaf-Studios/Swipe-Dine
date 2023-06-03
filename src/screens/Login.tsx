import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Box from "../components/Box";
import StyledTextInput from "../components/StyledTextInput";
import Logo from "../components/Logo";
import Layout from "../components/Layout";
import {
  AppleAuthenticationButton,
  AppleAuthenticationButtonStyle,
  AppleAuthenticationButtonType,
} from "expo-apple-authentication";
import { SocialIcon } from "react-native-elements";
import Button from "../components/Button";
import Text from "../components/Text";
import useAuth from "../hooks/useAuth";

const Login = ({ navigation }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: null,
    password: null,
  });
  const [loading, setLoading] = useState({
    google: false,
    facebook: false,
    normal: false,
  });
  const handleSubmit = async () => {
    setLoading((loading) => {
      return {
        ...loading,
        normal: true,
      };
    });

    const result = await signIn(email, password);

    if (result) setErrors(result);
    else {
      setErrors({ email: null, password: null });
    }

    setLoading((loading) => {
      return {
        ...loading,
        normal: false,
      };
    });
  };
  return (
    <Layout variant="main">
      <Box
        width={{ phone: "100%" }}
        flexGrow={{ phone: 1, tablet: 0.8, largeTablet: 0.6 }}
        flexDirection="column"
        justifyContent="center"
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
              ? { phone: 3, longPhone: 2, tablet: 3 }
              : 1.7
          }
          gap={{ phone: "s", tablet: "m" }}
          maxHeight={{ phone: "100%", longPhone: "30%", tablet: "100%" }}
          flexDirection="column"
          justifyContent={"flex-start"}
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
          <Box flex={0.5} maxHeight={30}>
            <Button
              variant="auth-nav"
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text
                variant="body"
                color="darkGray"
                fontWeight="bold"
                textAlign="left"
                style={{
                  width: "100%",
                }}
              >
                Forgot password?
              </Text>
            </Button>
          </Box>
        </Box>

        {/* Login Button */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={errors.email || errors.password ? 0.8 : 0.5}
          minHeight={{ phone: 30, tablet: 70 }}
          maxHeight={{ phone: 60, tablet: 80 }}
        >
          <Button variant="login" onPress={handleSubmit}>
            <Text
              variant="header"
              color={errors.email || errors.password ? "error" : "success"}
            >
              {loading.normal ? "Logging in..." : "Login"}
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
            buttonType={AppleAuthenticationButtonType.SIGN_IN}
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
          flex={0.3}
        >
          <Button
            variant="auth-nav"
            onPress={() => navigation.navigate("SignUp")}
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
              Don't have an account yet?
            </Text>
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({});
