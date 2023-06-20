import {
  SpacingProps,
  VariantProps,
  useRestyle,
  createVariant,
  composeRestyleFunctions,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import { Image } from "react-native";

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  createVariant({ themeKey: "imageVariants" }),
]);

type RestyleProps = SpacingProps<Theme> & VariantProps<Theme, "imageVariants">;

type Props = RestyleProps & {
  uri: string;
};

const CustomImage = ({ uri, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);
  return <Image {...props} source={{ uri: uri }} />;
};

export default CustomImage;
