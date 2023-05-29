import { createTheme } from "@shopify/restyle";

const palette = {
  purpleLight: "#8C6FF7",
  purplePrimary: "#5A31F4",
  purpleDark: "#3F22AB",

  greenLight: "#56DCBA",
  greenPrimary: "#0ECD9D",
  greenDark: "#0A906E",

  darkGray: "#333",

  black: "#0B0B0B",
  white: "#F0F2F3",
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    cardPrimaryBackground: palette.greenLight,

    cardShadowColor: "#000",
    secondaryCardBackground: palette.white,
    secondaryCardText: palette.white,
    buttonPrimaryBackground: palette.greenLight,
    buttonPrimaryText: palette.white,
    black: palette.black,
    white: palette.white,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },

  inputVariants: {
    login: {
      backgroundColor: "white",
      height: 40,
      padding: "s",
      borderRadius: 4,
      width: 250,
    },
  },
  textVariants: {
    logo: {
      fontFamily: "ShopifySans-Bold",
      fontWeight: "bold",
      fontSize: 48,
      lineHeight: 48.5,
      color: "white",
    },
    header: {
      fontFamily: "ShopifySans-Bold",
      fontWeight: "bold",
      fontSize: 34,
      lineHeight: 42.5,
      color: "black",
    },
    subheader: {
      fontFamily: "ShopifySans-SemiBold",
      fontWeight: "600",
      fontSize: 28,
      lineHeight: 36,
      color: "black",
    },
    body: {
      fontFamily: "ShopifySans",
      fontSize: 16,
      lineHeight: 24,
      color: "black",
    },
  },
  buttonVariants: {
    defaults: {
      width: "100%",
      backgroundColor: "buttonPrimaryBackground",
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    login: {
      width: 250,
      flex: 0.25,
      color: "white",
    },
  },
  cardVariants: {
    defaults: {
      // We can define defaults for the variant here.
      // This will be applied after the defaults passed to createVariant and before the variant defined below.
      width: "100%",
      height: "100%",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      padding: {
        phone: "s",
        tablet: "m",
      },
    },
    regular: {
      // We can refer to other values in the theme here, and use responsive props
      padding: {
        phone: "s",
        tablet: "m",
      },
    },
    swipe: {
      backgroundColor: "cardPrimaryBackground",
      borderRadius: 20,
      width: "95%",
      flex: 9,
      shadowColor: "cardShadowColor",
      overflow: "hidden",
      position: "relative",
      padding: {
        phone: 0,
        tablet: 0,
      },
    },
    elevated: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      shadowColor: "cardShadowColor",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 15,
      elevation: 5,
    },
  },
  defaults: {
    // We can define a default text variant here.
  },
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812,
    },
    tablet: 768,
    largeTablet: 1024,
  },
});

export type Theme = typeof theme;

const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    mainBackground: palette.black,
    mainForeground: palette.white,

    secondaryCardBackground: palette.darkGray,
    secondaryCardText: palette.white,
  },
};
export { darkTheme, theme };
