import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import { AuthenticatedUserProvider } from "./src/hooks/useAuth";
import RootNavigation from "./src/navigation/RootNavigation";
import { RecoilRoot } from "recoil";
import { GlassfyProvider } from "./src/lib/GlassfyProvider";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const activeTheme = darkMode ? darkTheme : theme;
  return (
    <ThemeProvider theme={activeTheme}>
      <AuthenticatedUserProvider>
        <GlassfyProvider>
          <RecoilRoot>
            <RootNavigation />
          </RecoilRoot>
        </GlassfyProvider>
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
}
