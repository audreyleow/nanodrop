import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

import ErrorPage from "@/common/components/ErrorPage";

import useMyDrops from "../hooks/useMyDrops";
import Drop from "./Drop";

export default function MyDrops() {
  const { data } = useMyDrops();

  const { publicKey } = useWallet();
  if (!publicKey) {
    return (
      <ErrorPage>
        <Typography variant="h6">Please connect your Solana wallet</Typography>
      </ErrorPage>
    );
  }

  if (!data) {
    return <CircularProgress size={20} color="inherit" />;
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
