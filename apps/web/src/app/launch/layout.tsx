"use client";

import { Container } from "@mui/material";

import LaunchStoreProvider from "./providers/LaunchProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container maxWidth="md">
      <LaunchStoreProvider>{children}</LaunchStoreProvider>
    </Container>
  );
}
