import React from "react";
import Logo from "../components/Logo";
import { Image, StyleSheet, View } from "react-native";
import Box from "../components/Box";
import LinearGradient from "../components/LinearGradient";
import MaskedView from "../components/MaskedView";

const Loading = () => {
  return (
    <>
      <Image
        source={{
          uri: "https://i.pinimg.com/originals/87/da/1e/87da1e47f484e30b95bfa2e0c6ecdd72.jpg",
        }}
        style={{
          width: "100%",
          height: "100%",
          top: 0,
          zIndex: -10,
          position: "absolute",
          resizeMode: "cover",
        }}
      />
      <Box
        width={200}
        height={100}
        backgroundColor="darkGray"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        borderRadius={999}
        shadowColor="black"
        shadowOpacity={1}
        shadowRadius={50}
        overflow="hidden"
      >
        <Logo variant="logo" />
      </Box>
    </>
  );
};

export default Loading;
