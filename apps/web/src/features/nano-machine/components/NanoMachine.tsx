import { Box, Container, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import Link from "next/link";

import NanodropLogo from "@/common/components/NanodropLogo";
import ErrorPage from "@/features/nano-machine/components/ErrorPage";
import MintPage from "@/features/nano-machine/components/MintPage";
import useNanoMachine from "@/features/nano-machine/hooks/useNanoMachine";

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

export default function NanoMachine() {
  const {
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    fetchNanoMachineError,
  } = useNanoMachine();

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
          component={Link}
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
        <WalletMultiButtonDynamic />
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
