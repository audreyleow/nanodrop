import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";

import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import { AppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";

import theme from "../common/theme";
import createEmotionCache from "../common/utils/createEmotionCache";

require("@solana/wallet-adapter-react-ui/styles.css");

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_ORIGIN;

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(function enableRendering() {
    setShouldRender(true);
  }, []);

  if (!shouldRender) {
    return null;
  }

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
        <title>Nanodrop</title>
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "html, body, #__next": {
              height: "100%",
            },
          }}
        />
        <CssBaseline />
        <Toaster expand position="bottom-left" duration={5000} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
