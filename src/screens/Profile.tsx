import { Image, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Layout from "../components/Layout";
import Box from "../components/Box";
import Text from "../components/Text";
import * as ImagePicker from "expo-image-picker";
import StyledTextInput from "../components/StyledTextInput";
import Button from "../components/Button";
import useAuth from "../hooks/useAuth";
type Props = {};

const Profile = (props: Props) => {
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
          {firstTime ? "Create Profile" : "Edit Profile"}
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
        <Button
          variant="home"
          onPress={() => saveProfile(image, username, user)}
        >
          <Text variant="subheader" color="buttonPrimaryText">
            Save Profile
          </Text>
        </Button>
      </Box>
    </Layout>
  );
};

export default Profile;

const styles = StyleSheet.create({});
