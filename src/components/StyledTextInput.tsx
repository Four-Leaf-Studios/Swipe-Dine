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
import Text from "./Text";
import Box from "./Box";
import { useState } from "react";

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  createVariant({ themeKey: "inputVariants" }),
]);

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "inputVariants">;

type Props = RestyleProps & {
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
  value: string;
  message: string | null;
  onChangeText: Function;
  secure?: boolean;
};

const StyledTextInput = ({
  placeholder,
  keyboardType,
  message,
  value,
  onChangeText,
  secure,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, rest);
  return (
    <Box width="100%" flexDirection="column" gap="s">
      <TextInput
        {...props}
        placeholder={placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={(text) => onChangeText(text)}
        secureTextEntry={secure}
      />
      {message && (
        <Box backgroundColor="error" padding="s" borderRadius={5}>
          <Text variant="body" color="white">
            {message}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default StyledTextInput;
