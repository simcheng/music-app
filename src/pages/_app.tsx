import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@/styles/globals.css";
import "@fontsource/playfair-display/700.css";

import type { AppProps } from "next/app";

const theme = createTheme();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ height: "100%", backgroundColor: "#000" }}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
