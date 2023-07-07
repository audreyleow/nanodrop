import {
  getSpaceForNanoMachine,
  NANODROP_PROGRAM_ID,
} from "@nanodrop/contracts";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Connection, Keypair, SystemProgram } from "@solana/web3.js";

export default async function createCreateNanoMachineAccountIx({
  phasesCount,
  walletAdapter,
  connection,
  nanoMachineKeypair,
}: {
  walletAdapter: WalletContextState;
  connection: Connection;
  phasesCount: number;
  nanoMachineKeypair: Keypair;
}) {
  const size = getSpaceForNanoMachine(phasesCount);

  const ix = SystemProgram.createAccount({
    fromPubkey: walletAdapter.publicKey,
    newAccountPubkey: nanoMachineKeypair.publicKey,
    space: size,
    lamports: await connection.getMinimumBalanceForRentExemption(size),
    programId: NANODROP_PROGRAM_ID,
  });

  return ix;
}
