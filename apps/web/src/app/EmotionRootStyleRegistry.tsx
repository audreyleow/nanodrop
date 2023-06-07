"use client";

import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";

import createCache from "@emotion/cache";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { Toaster } from "sonner";

import theme from "../common/theme";

require("@solana/wallet-adapter-react-ui/styles.css");

export default function EmotionRootStyleRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: "css" });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(" "),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            html: {
              height: "100%",
            },
            body: {
              height: "100%",
            },
          }}
        />
        <CssBaseline />
        <Toaster expand position="bottom-left" duration={5000} />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
