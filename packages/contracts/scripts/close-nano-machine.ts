import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import { program } from "./program";

const NANO_MACHINE = new PublicKey(
  "metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid" // 10000 items
);

export const closeNanoMachine = async (
  connection: Connection,
  payer: Keypair
) => {
  const closeIx = await program.methods
    .close()
    .accounts({
      authority: payer.publicKey,
      nanoMachine: NANO_MACHINE,
    })
    .instruction();

  const transaction = new Transaction().add(closeIx);

  // send the transaction
  await sendAndConfirmTransaction(connection, transaction, [payer], {
    commitment: "confirmed",
    skipPreflight: true,
  });

  console.log(
    "Nano machine account closed successfully:",
    NANO_MACHINE.toBase58()
  );
};
