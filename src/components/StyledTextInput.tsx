import { KeyboardType, KeyboardTypeOptions, TextInput } from "react-native";
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  VariantProps,
  useRestyle,
  createVariant,
  composeRestyleFunctions,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import { UseFormRegisterReturn } from "react-hook-form";

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  createVariant({ themeKey: "inputVariants" }),
]);

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "inputVariants">;

type Props = RestyleProps & {
  register: UseFormRegisterReturn;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
};

const StyledTextInput = ({
  register,
  placeholder,
  keyboardType,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return (
    <TextInput
      {...props}
      placeholder={placeholder}
      keyboardType={keyboardType}
      {...register}
    />
  );
};

export default StyledTextInput;
