import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/sora/400.css";
import "@fontsource/sora/500.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App.tsx";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import { brandTheme } from "./brandTheme.ts";

import { AuthContextProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <MantineProvider theme={brandTheme}>
    <StrictMode>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </StrictMode>
  </MantineProvider>,
);
