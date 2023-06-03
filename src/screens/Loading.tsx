import React, { useEffect, useRef } from "react";
import Logo from "../components/Logo";
import { Animated, useAnimatedValue } from "react-native";
import Box from "../components/Box";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";

const Loading = () => {
  return (
    <Layout variant="main" gradient>
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <AnimatedLogo />
      </Box>
    </Layout>
  );
};

export default Loading;
