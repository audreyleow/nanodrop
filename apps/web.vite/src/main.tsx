import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sonner";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import theme from "./app/theme";
import SolanaProvider from "./common/providers/SolanaProvider";
import { NanoMachine } from "./features/nano-machine";
import App from "./App";

import "@fontsource/work-sans/300.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/700.css";
import "@solana/wallet-adapter-react-ui/styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:nanoMachineId",
    element: <NanoMachine />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SolanaProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            "html, body, #root": {
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
