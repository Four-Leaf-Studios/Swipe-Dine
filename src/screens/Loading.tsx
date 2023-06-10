import Box from "../components/Box";
import Layout from "../components/Layout";
import AnimatedLogo from "../components/AnimatedLogo";

const Loading = () => {
  return (
    <Layout variant="main" gradient>
      <Box
        width="100%"
        flex={1}
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
      >
        <AnimatedLogo />
      </Box>
    </Layout>
  );
};

export default Loading;
