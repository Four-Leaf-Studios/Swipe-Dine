import { Image, TouchableOpacity } from "react-native";
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
      headerTitleStyle: {
        color: "white",
      },
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
        width="100%"
        flex={1}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          width="100%"
          height="40%"
          justifyContent={"center"}
          alignItems={"center"}
          backgroundColor="darkGray"
          paddingBottom="xl"
        >
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: image }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 999,
              }}
            />
          </TouchableOpacity>
        </Box>
        <Box
          width="100%"
          position="absolute"
          bottom={0}
          height="60%"
          backgroundColor={"darkGray"}
        >
          <Box
            height="100%"
            justifyContent={"space-between"}
            alignItems="center"
            overflow="hidden"
            shadowColor={"white"}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            backgroundColor={"white"}
            shadowOpacity={0.25}
            elevation={4}
            shadowRadius={4}
            shadowOffset={{ width: 0, height: -4 }}
            padding="l"
          >
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
        </Box>
      </Box>
    </Layout>
  );
};

export default Settings;
