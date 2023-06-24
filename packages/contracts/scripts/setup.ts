import * as anchor from "@coral-xyz/anchor";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import { program } from "./program";

const coSigner = Keypair.fromSecretKey(Uint8Array.from([]));

export async function setup(connection: Connection, payer: Keypair) {
  const [config] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );

  const [programData] = PublicKey.findProgramAddressSync(
    [program.programId.toBuffer()],
    new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")
  );

  const ix = await program.methods
    .setup()
    .accounts({
      config,
      coSigner: coSigner.publicKey,
      program: program.programId,
      programData,
      programAuthority: payer.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  const tx = new Transaction().add(ix);
  tx.feePayer = payer.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  tx.partialSign(coSigner);
  tx.partialSign(payer);

  const txId = await connection.sendRawTransaction(tx.serialize(), {
    skipPreflight: true,
  });

  console.log(`https://solscan.io/tx/${txId}`);
}
