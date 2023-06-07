import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";
import "@solana/wallet-adapter-react-ui/styles.css";

import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import type { GatsbyBrowser } from "gatsby";
import React from "react";
import { Toaster } from "sonner";

import theme from "./src/app/theme";
import SolanaProvider from "./src/common/providers/SolanaProvider";

export const wrapPageElement: GatsbyBrowser["wrapPageElement"] = ({
  element,
}) => (
  <ThemeProvider theme={theme}>
    <SolanaProvider>
      <GlobalStyles
        styles={{
          "html, body, #___gatsby, #gatsby-focus-wrapper, #gatsby-focus-wrapper > div":
            {
              height: "100%",
            },
        }}
      />
      <CssBaseline />
      <Toaster expand position="bottom-left" duration={5000} />
      {element}
    </SolanaProvider>
  </ThemeProvider>
);
