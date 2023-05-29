import { TouchableOpacity, View } from "react-native";
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
  useTheme,
  useResponsiveProp,
} from "@shopify/restyle";

import Text from "./Text";
import { Theme } from "../../theme";

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
};

const Button = ({ onPress, label, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <Text variant="subheader" color="buttonPrimaryText">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
