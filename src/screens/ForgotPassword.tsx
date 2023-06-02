import { StyleSheet } from "react-native";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Logo from "../components/Logo";
import StyledTextInput from "../components/StyledTextInput";
import Button from "../components/Button";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: null,
  });

  const handleSubmit = () => {
    if (errors.email) setErrors({ email: null });
    else
      setErrors({
        email: "Email does not exist in our system.",
      });
  };
  return (
    <Layout variant="white">
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
          maxHeight={{ phone: 100, tablet: 200 }}
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
          flex={1}
          maxHeight={errors.email ? 150 : 100}
          gap="m"
        >
          <StyledTextInput
            placeholder="Email"
            keyboardType={"email-address"}
            value={email}
            message={errors.email}
            variant="login"
            onChangeText={setEmail}
          />
        </Box>

        {/* Login Button */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
          maxHeight={{ phone: 120, tablet: 150 }}
        >
          <Button variant="login" label="Login" onPress={handleSubmit}>
            <Text variant="header" color={errors.email ? "error" : "success"}>
              Reset Password
            </Text>
          </Button>
          <Button
            variant="auth-nav"
            label="Already have an account?"
            onPress={() => {}}
          >
            <Text
              variant="body"
              color="darkGray"
              fontWeight="bold"
              textAlign="left"
              padding="s"
              style={{
                width: "100%",
              }}
            >
              Back to login?
            </Text>
          </Button>
        </Box>
      </Box>
    </Layout>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({});
