import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useNanoMachine from "../hooks/useNanoMachine";
import SolanaPayQr from "./SolanaPayQr";

const styles = {
  logo: {
    width: "100%",
    height: "100%",
    color: "grey.500",
  },
};

export default function NanoMachineInfo() {
  const { nanoMachine } = useNanoMachine();

  const { signTransaction } = useWallet();
  const { connection } = useConnection();

  return (
    <>
      <AspectRatioBox aspectHeight={1} aspectWidth={1}>
        <Avatar
          variant="rounded"
          src={nanoMachine?.currentPhase.phaseImageUrl}
          sx={styles.logo}
        >
          <CircularProgress size={20} color="inherit" />
        </Avatar>
      </AspectRatioBox>
      <Box
        sx={{
          px: 8,
          py: 4,
          "&& > *": {
            mb: 2,
          },
        }}
      >
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "2.5rem" }} />
        ) : (
          <Typography variant="h4" fontWeight="500">
            {nanoMachine.currentPhase.name}
          </Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.25rem" }} />
        ) : (
          <Typography variant="body2">
            Items minted: {nanoMachine.itemsRedeemed}
          </Typography>
        )}
        <SolanaPayQr />
      </Box>
    </>
  );
}
