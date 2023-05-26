import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import { program } from "./program";

const NANO_MACHINE = new PublicKey(
  "GXcC2ChT3yXEr3VqszakLs2u74A9HBtwBr4sAriqSvzC" // 10 items
);

export async function updateNanoMachine(
  connection: Connection,
  payer: Keypair
) {
  const ix = await program.methods
    .update({
      goLiveDate: new anchor.BN(Date.now() / 1000),
      price: null,
    })
    .accounts({
      authority: payer.publicKey,
      nanoMachine: NANO_MACHINE,
      paymentMint: program.programId,
    })
    .instruction();

  const tx = new Transaction().add(ix);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
    skipPreflight: true,
  });

  console.log("Nano machine updated successfully: ", NANO_MACHINE.toBase58());
}
