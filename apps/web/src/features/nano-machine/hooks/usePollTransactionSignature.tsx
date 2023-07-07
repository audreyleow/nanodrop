import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import getSolanaPayTransaction from "../utils/getSolanaPayTransaction";

interface UsePollTransactionSignatureParams {
  setJwtSecret: (jwtSecret: string) => void;
  authMessage: string | undefined;
  onClose: () => void;
}

export default function usePollTransactionSignature({
  setJwtSecret,
  authMessage,
  onClose,
}: UsePollTransactionSignatureParams) {
  const { nanoMachineId } = useParams();
  const { connection } = useConnection();
  const [solanaPayReference, setSolanaPayReference] = useState(
    Keypair.generate().publicKey
  );

  useEffect(
    function pollTransactionSignature() {
      let timeoutId: NodeJS.Timeout;
      let hasUnmounted = false;

      if (authMessage) {
        timeoutId = setTimeout(async function poll() {
          const transactionSignature = await getSolanaPayTransaction(
            connection,
            solanaPayReference
          );
          if (transactionSignature && !hasUnmounted) {
            try {
              const jwtSecret = await axios
                .post<string>("/v1/auth/verify", {
                  nanoMachineId,
                  message: authMessage,
                  txId: transactionSignature,
                })
                .then((res) => res.data);

              toast.success("Minting QR code successfully unlocked!");
              setJwtSecret(jwtSecret);
              onClose();
              return;
            } catch (e) {
              if (e.response) {
                toast.error(e.response.data.message);
              } else if (e instanceof Error) {
                toast.error(e.message);
              }
            } finally {
              // generate new reference key
              setSolanaPayReference(Keypair.generate().publicKey);
            }
          }
          if (!hasUnmounted) {
            timeoutId = setTimeout(poll, 1000);
          }
        }, 1000);
      }

      return () => {
        clearTimeout(timeoutId);
        hasUnmounted = true;
      };
    },
    [
      authMessage,
      connection,
      nanoMachineId,
      onClose,
      setJwtSecret,
      solanaPayReference,
    ]
  );

  return solanaPayReference.toBase58();
}
