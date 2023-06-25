import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

import ErrorPage from "@/common/components/ErrorPage";
import CtaButton from "@/features/landing-page/components/CtaButton";
import MorphingArrow from "@/features/landing-page/components/MorphingTriangle";

import useMyDrops from "../hooks/useMyDrops";
import Drop from "./Drop";

export default function MyDrops() {
  const { data, isLoading } = useMyDrops();

  const { publicKey } = useWallet();
  if (!publicKey) {
    return (
      <ErrorPage>
        <Typography variant="h6">Please connect your Solana wallet</Typography>
      </ErrorPage>
    );
  }

  if (isLoading) {
    return (
      <CircularProgress
        sx={{
          mx: "auto",
          display: "block",
        }}
        size={20}
        color="inherit"
      />
    );
  }

  if (data === undefined) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontWeight: "500",
          }}
        >
          It feels lonely here...
        </Typography>
        <CtaButton
          as={Link}
          href="/create"
          sx={{
            display: "inline-flex",
          }}
        >
          <Typography
            variant="button"
            sx={{
              fontWeight: 700,
              color: "#000000",
            }}
          >
            create your first drop
          </Typography>
          <MorphingArrow />
        </CtaButton>
      </Box>
    );
  }

  return (
    <Container
      sx={{
        position: "relative",
        pb: 8,
        zIndex: 2,
      }}
      fixed
      maxWidth="lg"
    >
      <Typography variant="h4" fontWeight="500" sx={{ mb: 4 }}>
        My drops
      </Typography>
      <Grid container gap={4}>
        {data.map((nanoMachine) => (
          <Drop
            nanoMachineId={nanoMachine.nanoMachineId}
            createdAt={nanoMachine.createdAt}
            key={nanoMachine.nanoMachineId}
          />
        ))}
      </Grid>
    </Container>
  );
}
