import { Image, Linking, Platform, TouchableOpacity } from "react-native";
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
import { saveProfile } from "../lib/firebaseHelpers";
import CustomImage from "../components/CustomImage";
import { ScrollView } from "react-native-gesture-handler";

const Settings = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { darkGray } = theme.colors;
  const {
    setFirstTime,
    firstTime,
    setUserProfile,
    userProfile: userprofile,
    user,
    logout,
  } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      ...navigation.options,
      headerStyle: { backgroundColor: darkGray },
      headerTitleStyle: {
        color: "white",
      },
    });
  }, [navigation]);

  const [image, setImage] = useState<string>(
    user?.photoURL
      ? user.photoURL
      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  );
  const [username, setUsername] = useState(
    user?.displayName ? user.displayName : ""
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

  const handleSaveProfile = async () => {
    setLoading(true);
    const profile = await saveProfile(image, username, user);
    if (profile) {
      setFirstTime(false);
      setUserProfile((userprofile) => {
        return { ...userprofile, ...profile };
      });
    }
    setLoading(false);
  };

  const handleContactSupport = async () => {
    const email = "swipeanddineofficial@gmail.com";
    let url = "";

    if (Platform.OS === "ios") {
      url = `mailto:${email}`;
    } else if (Platform.OS === "android") {
      url = `mailto:${email}`;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        throw new Error("Failed to open email client.");
      }
    } catch (error) {}
  };

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
            <CustomImage uri={image} variant="settings" />
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
            overflow="hidden"
            shadowColor={"white"}
            borderTopLeftRadius={20}
            borderTopRightRadius={20}
            backgroundColor={"white"}
            shadowOpacity={0.25}
            elevation={4}
            shadowRadius={4}
            shadowOffset={{ width: 0, height: -4 }}
          >
            <ScrollView>
              <Box
                height="100%"
                justifyContent={"space-between"}
                alignItems="center"
                overflow="hidden"
                padding="l"
                gap="l"
              >
                <Box flex={1} width="100%" gap="l">
                  <Text variant="body" color="orangeDark">
                    Username
                  </Text>
                  <StyledTextInput
                    variant="room"
                    placeholder={"Username"}
                    keyboardType={"default"}
                    value={username}
                    message={""}
                    color={"darkGray"}
                    onChangeText={setUsername}
                  />
                  {(username !== userprofile?.displayName ||
                    image !== userprofile?.photoURL) && (
                    <Button
                      disabled={loading}
                      variant="home"
                      onPress={handleSaveProfile}
                    >
                      <Text variant="subheader" color="buttonPrimaryText">
                        {loading
                          ? firstTime
                            ? "Saving Profile"
                            : "Updating Profile"
                          : firstTime
                          ? "Save Profile"
                          : "Update Profile"}
                      </Text>
                    </Button>
                  )}
                </Box>
                <Button
                  disabled={loading}
                  variant="home"
                  onPress={handleContactSupport}
                >
                  <Text variant="subheader" color="buttonPrimaryText">
                    Contact Support
                  </Text>
                </Button>
                <Button disabled={loading} variant="home" onPress={logout}>
                  <Text variant="subheader" color="buttonPrimaryText">
                    Logout
                  </Text>
                </Button>
              </Box>
            </ScrollView>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Settings;
