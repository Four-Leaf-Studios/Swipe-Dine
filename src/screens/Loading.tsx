import React, { useEffect, useRef } from "react";
import Logo from "../components/Logo";
import { Animated, useAnimatedValue } from "react-native";
import Box from "../components/Box";
import MaskedViewCustom from "../components/MaskedViewCustom";
import Text from "../components/Text";
import Layout from "../components/Layout";

const Loading = () => {
  const progress = useAnimatedValue(0.5);
  const scale = useAnimatedValue(1);

  const animation = Animated.loop(
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(3000),
    ])
  );

  useEffect(() => {
    animation.start();
  }, []);

  const SIZE = 30.0;
  return (
    <Layout variant="main">
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <Animated.View
          style={{
            borderRadius: progress.interpolate({
              inputRange: [0.5, 1],
              outputRange: [SIZE / 4, SIZE / 2],
            }),
            transform: [{ scale }],
            overflow: "hidden",
          }}
        >
          <Box
            width={{ phone: 200, tablet: 300 }}
            height={{ phone: 100, tablet: 150 }}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            backgroundColor="white"
            shadowColor="black"
            shadowOpacity={1}
            shadowRadius={10}
            overflow="hidden"
          >
            <MaskedViewCustom linearGradientVariant={"main"} noBorder>
              <Text variant={"header"}>Foodr</Text>
            </MaskedViewCustom>
          </Box>
        </Animated.View>
      </Box>
    </Layout>
  );
};

export default Loading;
