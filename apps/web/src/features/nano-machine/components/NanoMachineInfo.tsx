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
  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <SolanaPayQr />
    </Box>
  );
}
