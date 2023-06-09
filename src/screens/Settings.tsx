import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../theme";
import Box from "../components/Box";
import Text from "../components/Text";
import useAuth from "../hooks/useAuth";
import Layout from "../components/Layout";
import StyledTextInput from "../components/StyledTextInput";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";

const Settings = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray } = theme.colors;
  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerStyle: { backgroundColor: darkGray },
      headerRight: () => (
        <Box paddingRight="l">
          <TouchableOpacity onPress={() => {}}>
            <Text variant="body" color="white">
              Settings
            </Text>
          </TouchableOpacity>
        </Box>
      ),
    });
  }, [navigation]);

  const { saveProfile, user, firstTime } = useAuth();
  const [image, setImage] = useState<string>(
    user.photoURL
      ? user.photoURL
      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const [username, setUsername] = useState(
    user.displayName ? user.displayName : ""
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSaveProfile = () => saveProfile(image, username, user);
  return (
    <Layout variant="main">
      <Box
        flex={1}
        width="100%"
        flexDirection={"column"}
        justifyContent={"space-between"}
        alignItems="center"
        padding="m"
        gap="l"
      >
        <Text variant="subheader" color="orangeDark">
          Settings
        </Text>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image }}
            style={{
              width: 200,
              height: 200,
              borderRadius: 999,
            }}
          />
        </TouchableOpacity>

        <StyledTextInput
          variant="room"
          placeholder={"Username"}
          keyboardType={"default"}
          value={username}
          message={""}
          color={"darkGray"}
          onChangeText={setUsername}
        />
        <Button variant="home" onPress={handleSaveProfile}>
          <Text variant="subheader" color="buttonPrimaryText">
            Save Profile
          </Text>
        </Button>
      </Box>
    </Layout>
  );
};

export default Settings;
