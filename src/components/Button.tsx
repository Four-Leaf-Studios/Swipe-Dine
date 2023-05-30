import { TouchableOpacity } from "react-native";
import {
  useRestyle,
  spacing,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  composeRestyleFunctions,
  VariantProps,
  createVariant,
} from "@shopify/restyle";

import Text from "./Text";
import { Theme } from "../../theme";
import LinearGradient from "./LinearGradient";
import { ReactElement } from "react";
type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "buttonVariants">;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  backgroundColor,
  createVariant({ themeKey: "buttonVariants" }),
]);

type Props = RestyleProps & {
  onPress: () => void;
  label: string;
  children?: ReactElement;
};

const Button = ({ onPress, label, children, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress} {...props}>
      {rest.variant === "swipeScreenButton" && children}
      {rest.variant === "login" && (
        <LinearGradient variant="main">
          <Text variant="subheader" color="buttonPrimaryText">
            {label}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

export default Button;
