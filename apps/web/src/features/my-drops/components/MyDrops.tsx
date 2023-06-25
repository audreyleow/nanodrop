import { Typography } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

import ErrorPage from "@/common/components/ErrorPage";

export default function MyDrops() {
  const { publicKey } = useWallet();
  if (!publicKey) {
    return (
      <ErrorPage>
        <Typography variant="h6">Please connect your Solana wallet</Typography>
      </ErrorPage>
    );
  }

  return null;
}
