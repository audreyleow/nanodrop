import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

import { HIDDEN_SECTION_START } from "../src/constants/hiddenSectionStart";
import { CONNECTION } from "./constants";

export async function createNanoMachineAccount(
  payer: Keypair,
  programId: PublicKey,
  itemsAvailable: number
) {
  const size = HIDDEN_SECTION_START + itemsAvailable * 4 + 4; // mint indices + u32 to support swapping from last index to first index

  const nanoMachine = Keypair.generate();

  const ix = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: nanoMachine.publicKey,
    space: size,
    lamports: await CONNECTION.getMinimumBalanceForRentExemption(size),
    programId,
  });

  const tx = new Transaction().add(ix);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(
    CONNECTION,
    tx,
    // ensuring the `treeKeypair` PDA and the `payer` are BOTH signers
    [payer, nanoMachine],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  console.log(nanoMachine.publicKey.toBase58());

  return nanoMachine;
}
