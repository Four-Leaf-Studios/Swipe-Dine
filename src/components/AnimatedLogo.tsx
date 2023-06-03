import { Animated, StyleSheet, View, useAnimatedValue } from "react-native";
import React, { useEffect } from "react";
import Box from "./Box";
import MaskedViewCustom from "./MaskedViewCustom";
import Text from "./Text";
import Logo from "./Logo";
import {
  BackgroundColorProps,
  BorderProps,
  SpacingProps,
  VariantProps,
  composeRestyleFunctions,
  createVariant,
  useRestyle,
} from "@shopify/restyle";
import { Theme } from "../../theme";
type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "logoVariants">;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  createVariant({ themeKey: "logoVariants" }),
]);

type Props = RestyleProps & {};
const AnimatedLogo = ({ ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

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
        width={{ phone: 250, tablet: 3 }}
        height={{ phone: 100, tablet: 150 }}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        backgroundColor="white"
        shadowColor="black"
        shadowOpacity={1}
        shadowRadius={10}
        overflow="hidden"
        {...props}
      >
        <Logo variant="header" />
      </Box>
    </Animated.View>
  );
};

export default AnimatedLogo;

const styles = StyleSheet.create({});
