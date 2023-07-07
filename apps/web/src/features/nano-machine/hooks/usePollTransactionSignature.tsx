import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import getSolanaPayTransaction from "../utils/getSolanaPayTransaction";

export default function usePollTransactionSignature(
  setJwtSecret: (jwtSecret: string) => void
) {
  const { connection } = useConnection();
  const [solanaPayReference, setSolanaPayReference] = useState(
    Keypair.generate().publicKey
  );

  useEffect(
    function pollTransactionSignature() {
      let timeoutId = setTimeout(async function poll() {
        const transactionSignature = await getSolanaPayTransaction(
          connection,
          solanaPayReference
        );
        if (transactionSignature) {
          // make auth request to server
          try {
            await toast.promise(axios., {
              loading: 'Loading...',
              success: (data) => {
                return `${data.name} toast has been added`;
              },
              error: 'Error',
            });
          } catch {
          } finally {
            // generate new reference key
            setSolanaPayReference(Keypair.generate().publicKey);
          }
        }
        timeoutId = setTimeout(poll, 1000);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    },
    [connection, solanaPayReference]
  );

  return solanaPayReference.toBase58();
}
