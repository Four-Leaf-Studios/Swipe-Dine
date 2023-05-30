import { KeyboardType, KeyboardTypeOptions, TextInput } from "react-native";
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  VariantProps,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import Text from "./Text";

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "textVariants">;

type Props = RestyleProps & {};

const StyledTextInput = ({ ...rest }: Props) => {
  return (
    <Text variant={rest.variant} color="orangeDark">
      Foodr
    </Text>
  );
};

export default StyledTextInput;
