import {
  createVariant,
  createRestyleComponent,
  VariantProps,
  SpacingProps,
} from "@shopify/restyle";
import { Theme } from "../../theme";
import { ReactElement } from "react";

type Props = SpacingProps<Theme> &
  VariantProps<Theme, "cardVariants"> & { children: ReactElement };
const Card = createRestyleComponent<Props, Theme>([
  createVariant({ themeKey: "cardVariants" }),
]);

export default Card;
