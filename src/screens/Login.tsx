import Box from "../components/Box";
import Logo from "../components/Logo";
import Layout from "../components/Layout";
import * as AppleAuthentication from "expo-apple-authentication";
import auth from "@react-native-firebase/auth";

const Login = ({ navigation }) => {
  const handleAppleSignIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const { identityToken } = appleCredential;

      const credential = auth.AppleAuthProvider.credential(identityToken);

      // Sign in with Firebase using the Apple credential
      await auth().signInWithCredential(credential);
      // Call your custom sign-in function or navigate to the desired screen
    } catch (error) {
      console.log("Apple sign-in error:", error);
    }
  };

  return (
    <Layout variant="main">
      <Box
        width={{ phone: "100%" }}
        flexGrow={{ phone: 1, tablet: 0.8, largeTablet: 0.6 }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        padding="l"
        gap="m"
      >
        {/* Logo */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={1}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderRadius={10}
        >
          <Logo variant="header" />
        </Box>
        {/* Apple Sign In */}
        <Box
          width={{ phone: "100%", tablet: "60%", largeTablet: "50%" }}
          flex={0.5}
          minHeight={{ phone: 40, tablet: 60 }}
        >
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={
              AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
            }
            buttonStyle={
              AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
            }
            cornerRadius={5}
            style={{
              flex: 1,
            }}
            onPress={handleAppleSignIn}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default Login;
