import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Button, SxProps, Theme } from "@mui/material";
import { getMintIx } from "@nanodrop/contracts";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "sonner";

import useNanodrop from "@/common/hooks/useNanodrop";
import useToasts from "@/common/hooks/useToasts";

import useMintState from "../hooks/useMintState";
import useNanoMachine from "../hooks/useNanoMachine";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  {
    ssr: false,
  }
);

export default function MintButton({ sx }: { sx?: SxProps<Theme> }) {
  const { nanoMachine, mutate } = useNanoMachine();
  const wallet = useWallet();
  const { connection } = useConnection();
  const walletButtonContainerRef = useRef<HTMLDivElement>(null);
  const program = useNanodrop();

  const [loading, setLoading] = useState(false);
  const { disabled, message } = useMintState(loading);

  const { sendTransactionToast, errorToast, transactionSuccessToast } =
    useToasts();

  return (
    <Box sx={sx}>
      {!wallet.publicKey && !!nanoMachine ? (
        <Button
          variant="contained"
          fullWidth
          sx={{
            fontWeight: 700,
          }}
          onClick={() => {
            if (walletButtonContainerRef.current) {
              walletButtonContainerRef.current.querySelector("button")?.click();
            }
          }}
        >
          Connect Wallet
        </Button>
      ) : (
        <LoadingButton
          loading={!nanoMachine || loading}
          disabled={disabled}
          variant="contained"
          fullWidth
          sx={{
            display: "flex",
            gap: 1.5,
            alignItems: "center",
            fontWeight: 700,
          }}
          onClick={async () => {
            let sendTransactionToastId: number | string | undefined = undefined;
            if (wallet.publicKey && nanoMachine) {
              try {
                setLoading(true);

                const mintIx = await getMintIx(program, {
                  collectionMint: nanoMachine.collectionMint,
                  creator: nanoMachine.creator,
                  merkleTree: nanoMachine.merkleTree,
                  nanoMachineId: nanoMachine.id,
                  minter: wallet.publicKey,
                });
                const { blockhash, lastValidBlockHeight } =
                  await program.provider.connection.getLatestBlockhash();
                const messageV0 = new TransactionMessage({
                  payerKey: wallet.publicKey,
                  recentBlockhash: blockhash,
                  instructions: [mintIx],
                }).compileToV0Message();
                const transaction = new VersionedTransaction(messageV0);

                const signedTransaction = await wallet.signTransaction(
                  transaction
                );

                const signature = await connection.sendRawTransaction(
                  signedTransaction.serialize()
                );

                sendTransactionToastId = sendTransactionToast(signature);
                setLoading(false);

                const confirmResult = await connection.confirmTransaction({
                  signature,
                  blockhash,
                  lastValidBlockHeight,
                });
                if (confirmResult.value.err) {
                  throw new Error(JSON.stringify(confirmResult.value.err));
                }

                transactionSuccessToast(signature);
              } catch (e) {
                if (e instanceof Error) {
                  errorToast(e.message);
                }
              } finally {
                mutate();
                setLoading(false);

                if (sendTransactionToastId !== undefined) {
                  toast.dismiss(sendTransactionToastId);
                }
                sendTransactionToastId = undefined;
              }
            }
          }}
        >
          {message}
        </LoadingButton>
      )}
      <Box
        ref={walletButtonContainerRef}
        sx={{
          display: "none",
        }}
      >
        <WalletMultiButtonDynamic />
      </Box>
    </Box>
  );
}
