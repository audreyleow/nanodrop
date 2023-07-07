import {
  PublicKey,
} from "@metaplex-foundation/js";
import {
  createApproveCollectionAuthorityInstruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { Connection, Keypair, sendAndConfirmTransaction, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction } from "@solana/web3.js";

import { NANODROP_PROGRAM_ID } from "../src";

const COLLECTION_MINT = new PublicKey("nano1S2JBDfXw1faH5kGEgyX8nJXQ1LiGR2LudqeFXD")

export async function approveCollectionAuthority(connection: Connection, payer: Keypair) {
  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      COLLECTION_MINT.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), NANODROP_PROGRAM_ID.toBuffer()],
    NANODROP_PROGRAM_ID
  );
  const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      COLLECTION_MINT.toBuffer(),
      Buffer.from("collection_authority"),
      nanoMachinePdaAuthority.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  const approveCollectionAuthorityIx =
    createApproveCollectionAuthorityInstruction({
      collectionAuthorityRecord,
      metadata,
      mint: COLLECTION_MINT,
      newCollectionAuthority: nanoMachinePdaAuthority,
      payer: payer.publicKey,
      updateAuthority: payer.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    });

      // create and send the transaction to initialize the tree
  const tx = new Transaction().add(approveCollectionAuthorityIx);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(
    connection,
    tx,
    // ensuring the `treeKeypair` PDA and the `payer` are BOTH signers
    [payer],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  console.log({
    collectionMint: COLLECTION_MINT.toBase58(),
    collectionAuthority: nanoMachinePdaAuthority.toBase58(),
    nanodropAddress: NANODROP_PROGRAM_ID.toBase58(),
  })
}
