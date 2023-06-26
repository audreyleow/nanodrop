import { Box, Container, Link, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

import NanodropLogo from "@/common/components/NanodropLogo";

import SolanaProvider from "../providers/SolanaProvider";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          height: 48,
        }}
      />
    ),
  }
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SolanaProvider>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={(theme) => ({
            py: 6,
            px: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: theme.zIndex.appBar,
            gap: 2,
          })}
        >
          <Typography
            component="a"
            href="/"
            variant="h4"
            sx={(theme) => ({
              fontWeight: "700",
              color: "#fff",
              textDecoration: "none",
              [theme.breakpoints.down("sm")]: {
                fontSize: "1.25rem",
              },
              display: "flex",
              alignItems: "center",
              gap: 2,
            })}
          >
            <NanodropLogo width="30" height="30" />
            NanoDrop
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                textDecoration: "underline",
              }}
              component={Link}
              href="/me"
            >
              My drops
            </Typography>
            <WalletMultiButtonDynamic />
          </Box>
        </Box>
        <Box
          sx={{
            flex: "1 0 0",
          }}
        >
          {children}
        </Box>
      </Container>
    </SolanaProvider>
  );
}
