import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import theme from "./app/theme";
import SolanaProvider from "./common/providers/SolanaProvider";

import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SolanaProvider>
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
        <RouterProvider router={router} />
      </ThemeProvider>
    </SolanaProvider>
  </React.StrictMode>
);
