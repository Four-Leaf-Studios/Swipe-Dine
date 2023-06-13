import {
  createVariant,
  VariantProps,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  composeRestyleFunctions,
  useRestyle,
  useTheme,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import { ReactElement } from "react";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import Box from "./Box";
type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "linearGradientVariants">;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  createVariant({ themeKey: "linearGradientVariants" }),
]);

type Props = RestyleProps & {
  children?: ReactElement;
  gradient?: boolean;
};

const LinearGradient = ({ children, gradient, ...rest }: Props) => {
  const theme = useTheme<Theme>();
  const {
    orange,
    orangeDark,
    orangeLight,
    green,
    greenDark,
    greenLight,
    red,
    redDark,
    redLight,
    error,
    gray,
    darkGray,
  } = theme.colors;
  const props = useRestyle(restyleFunctions, rest);

  // Get the variant name from props

  const gradients = {
    main: [orangeDark, orange, orangeLight],
    red: [redDark, red, redLight],
    green: [greenDark, green, greenLight],
    gray: [darkGray, darkGray],
    shadow: [
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
      "rgba(255,255,255,0)",
      "rgba(0,0,0,.20)",
      "rgba(0,0,0,.55)",
      "rgba(0,0,0,.60)",
      "rgba(0,0,0,.65)",
      "rgba(0,0,0,.70)",
      "rgba(0,0,0,.75)",
      "rgba(0,0,0,.80)",
    ],
    login: ["rgba(255,255,255,.5)", "rgba(255,255,255,.5)"],
    burger: [],
    white: ["rgb(255,255,255)", "rgb(255,255,255)"],
    error: [error, error],
  };

  // Define the colors array based on the variant
  const colors = gradients[rest.variant as keyof typeof gradients];

  return (
    <Box {...props}>
      {!gradient ? (
        children
      ) : (
        <ExpoLinearGradient
          colors={colors}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <>{children}</>
        </ExpoLinearGradient>
      )}
    </Box>
  );
};

export default LinearGradient;
