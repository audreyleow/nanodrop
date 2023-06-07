import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { IDL, NANODROP_PROGRAM_ID } from "@nanodrop/contracts";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export default function useNanodrop() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const program = useMemo(
    () =>
      new Program(
        IDL,
        NANODROP_PROGRAM_ID,
        new AnchorProvider(connection, wallet, {
          commitment: connection.commitment,
        })
      ),
    [connection, wallet]
  );

  return program;
}
