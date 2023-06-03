import { ThemeProvider } from "@shopify/restyle";
import { darkTheme, theme } from "./theme";
import { useState } from "react";
import { AuthenticatedUserProvider } from "./src/hooks/useAuth";
import RootNavigation from "./src/navigation/RootNavigation";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const activeTheme = darkMode ? darkTheme : theme;
  return (
    <ThemeProvider theme={activeTheme}>
      <AuthenticatedUserProvider>
        <RootNavigation />
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
}
