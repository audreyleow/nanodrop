import { LoadingButton } from "@mui/lab";
import { Backdrop, Box, Button, Typography } from "@mui/material";
import { getAuthMessage } from "@nanodrop/contracts";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import useNanoMachine from "../hooks/useNanoMachine";
import MintCountDown from "./MintCountDown";

interface SolanaPayQrOverlayProps {
  jwtSecret: string | undefined;
  setJwtSecret: (jwtSecret: string) => void;
}

export default React.memo(function SolanaPayQrOverlay({
  jwtSecret,
  setJwtSecret,
}: SolanaPayQrOverlayProps) {
  const { nanoMachine } = useNanoMachine();
  const [hasMintStarted, setHasMintStarted] = useState(false);
  const checkHasMintStarted = useCallback(() => {
    if (
      nanoMachine?.currentPhase.startDate &&
      nanoMachine.currentPhase.startDate.getTime() <= Date.now()
    ) {
      setHasMintStarted(true);
    }
  }, [nanoMachine?.currentPhase.startDate]);
  useEffect(
    function updateMinStarted() {
      checkHasMintStarted();
      const interval = setInterval(checkHasMintStarted, 500);
      return () => {
        clearInterval(interval);
      };
    },
    [checkHasMintStarted]
  );

  const { publicKey, signMessage, disconnect } = useWallet();

  const showBackdrop = useMemo(
    () =>
      !nanoMachine ||
      !hasMintStarted ||
      !publicKey ||
      publicKey.toBase58() !== nanoMachine?.creator.toBase58() ||
      !jwtSecret,
    [hasMintStarted, jwtSecret, nanoMachine, publicKey]
  );

  const [isFetchingJwtSecret, setIsFetchingJwtSecret] = useState(false);

  return (
    <Backdrop
      open={showBackdrop}
      sx={{
        position: "absolute",
        zIndex: 2,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backdropFilter: "blur(0.25rem)",
        textAlign: "center",
        p: 2,
      }}
    >
      {!nanoMachine ? null : !hasMintStarted ? (
        <>
          <Typography>Mint starts in </Typography>
          <MintCountDown startDate={nanoMachine?.currentPhase.startDate} />
        </>
      ) : !publicKey ||
        publicKey.toBase58() !== nanoMachine?.creator.toBase58() ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography>
            Connect with wallet{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 700,
              }}
            >
              {nanoMachine?.creator.toBase58().slice(0, 4)}..
              {nanoMachine?.creator.toBase58().slice(-4)}
            </Box>{" "}
            to proceed
          </Typography>
          <Button
            variant="outlined"
            color="inherit"
            onClick={async () => {
              if (publicKey) {
                await disconnect();
              } else {
                const walletButton = document.getElementsByClassName(
                  "wallet-adapter-button"
                )[0];

                if (walletButton) {
                  (walletButton as any).click();
                }
              }
            }}
          >
            {publicKey ? "Disconnect" : "Connect"}
          </Button>
        </Box>
      ) : !jwtSecret ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography>Verify wallet to proceed</Typography>
          <LoadingButton
            loading={isFetchingJwtSecret}
            variant="outlined"
            color="inherit"
            onClick={async () => {
              try {
                setIsFetchingJwtSecret(true);

                const jwtSecret = await fetchJwtSecret(
                  signMessage,
                  publicKey,
                  nanoMachine.id.toBase58()
                );

                setJwtSecret(jwtSecret);
                toast.success("Wallet verified!");
              } catch (error) {
                toast.error(error.message);
              } finally {
                setIsFetchingJwtSecret(false);
              }
            }}
          >
            Verify
          </LoadingButton>
        </Box>
      ) : null}
    </Backdrop>
  );
});

const fetchJwtSecret = async (
  signMessage: (message: Uint8Array) => Promise<Uint8Array>,
  publicKey: PublicKey,
  nanoMachineId: string
) => {
  const authMessageParams = await axios
    .get<{
      nonce: string;
      issuedAt: string;
    }>(`/v1/auth/${publicKey.toBase58()}`)
    .then((res) => res.data);

  const authMessage = getAuthMessage({
    issuedAt: authMessageParams.issuedAt,
    nonce: authMessageParams.nonce,
    publicKey: publicKey.toBase58(),
  });

  const signedMessage = Buffer.from(
    await signMessage(new TextEncoder().encode(authMessage))
  ).toString("base64");

  const jwtSecret = await axios
    .post<string>(`/v1/nano-machines/secret/${nanoMachineId}`, {
      publicKey: publicKey.toBase58(),
      signedMessage,
      issuedAt: authMessageParams.issuedAt,
    })
    .then((res) => res.data);

  return jwtSecret;
};
