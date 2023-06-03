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

import { Theme } from "../../theme";
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
  children?: ReactElement;
};

const Button = ({ onPress, children, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress} {...props}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
