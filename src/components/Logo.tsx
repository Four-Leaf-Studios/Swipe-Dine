import { KeyboardType, KeyboardTypeOptions, TextInput } from "react-native";
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  VariantProps,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import Text from "./Text";
import MaskedViewCustom from "./MaskedViewCustom";

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "textVariants">;

type Props = RestyleProps & {};

const StyledTextInput = ({ ...rest }: Props) => {
  return (
    <MaskedViewCustom linearGradientVariant={"main"} noBorder>
      <Text variant={rest.variant}>Foodr</Text>
    </MaskedViewCustom>
  );
};

export default StyledTextInput;
