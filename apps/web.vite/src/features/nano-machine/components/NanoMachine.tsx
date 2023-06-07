"use client";

import NanodropLogo from "../../../common/components/NanodropLogo";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Box, Container, Typography } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import MintPage from "./MintPage";
import useNanoMachine from "../hooks/useNanoMachine";
import ErrorPage from "./ErrorPage";

export function NanoMachine() {
  const params = useParams();
  const {
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    fetchNanoMachineError,
  } = useNanoMachine(params.nanoMachineId);

  return (
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
          component={Link as any}
          to="/"
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
        <WalletMultiButton />
      </Box>
      <Box
        sx={{
          flex: "1 0 0",
        }}
      >
        {fetchCollectionMetadataError ||
        fetchCollectionUriMetadataError ||
        fetchNanoMachineError ? (
          <ErrorPage />
        ) : (
          <MintPage />
        )}
      </Box>
    </Container>
  );
}
