import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import axios from "axios";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useNanoMachine from "../hooks/useNanoMachine";

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
          <CircularProgress color="inherit" />
        </Avatar>
      </AspectRatioBox>
      <Box
        sx={{
          p: 8,
          pb: 5,
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
          <Skeleton variant="text" sx={{ height: "1.5rem" }} />
        ) : (
          <Typography>{nanoMachine.collectionName}</Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.25rem" }} />
        ) : (
          <Typography variant="body2">
            Created by:{" "}
            <Link
              href={`https://solscan.io/account/${nanoMachine.creator.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nanoMachine.creator.toBase58().slice(0, 4)}..
              {nanoMachine.creator.toBase58().slice(-4)}
            </Link>
          </Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.25rem" }} />
        ) : (
          <Typography variant="body2">
            Items minted: {nanoMachine.itemsRedeemed}
          </Typography>
        )}
        <Button
          onClick={async () => {
            const serializedTransaction = await axios
              .post("/v1/nano-machines/mint")
              .then((res) => res.data);

            const transaction = VersionedTransaction.deserialize(
              Buffer.from(serializedTransaction, "base64")
            );

            const signedTransaction = await signTransaction(transaction);
            const txId = await connection.sendRawTransaction(
              signedTransaction.serialize()
            );

            await connection.confirmTransaction(txId);

            console.log(`https://solscan.io/tx/${txId}`);
          }}
        >
          Test mint
        </Button>
      </Box>
    </>
  );
}
