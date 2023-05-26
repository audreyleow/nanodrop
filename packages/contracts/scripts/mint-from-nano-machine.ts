import * as anchor from "@coral-xyz/anchor";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
  Transaction,
} from "@solana/web3.js";

import { program } from "./program";

const COLLECTION_MINT = new PublicKey(
  "CSVsBhMPFi8kswkdHGpU9EW8sM8NdGW6dZT8BtxJPtrY"
);
const [COLLECTION_METADATA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    COLLECTION_MINT.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);
const [COLLECTION_MASTER_EDITION] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    COLLECTION_MINT.toBuffer(),
    Buffer.from("edition"),
  ],
  TOKEN_METADATA_PROGRAM_ID
);
const NANO_MACHINE = new PublicKey(
  "715oT2Dd9pRnVNG1D8QQUnnABhc69m1YtSATDXRGmWYg" // 10 items
);
const MERKLE_TREE = new PublicKey(
  "CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR" // 2 ^ 14 nodes
);
const [TREE_AUTHORITY] = PublicKey.findProgramAddressSync(
  [MERKLE_TREE.toBuffer()],
  BUBBLEGUM_PROGRAM_ID
);

export async function mintFromNanoMachine(
  connection: Connection,
  payer: Keypair
) {
  const [delegatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("delegate"), NANO_MACHINE.toBuffer()],
    program.programId
  );

  const [nanoMachineAuthorityPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), NANO_MACHINE.toBuffer()],
    program.programId
  );

  const [bubblegumSigner] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi")],
    BUBBLEGUM_PROGRAM_ID
  );

  const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      COLLECTION_MINT.toBuffer(),
      Buffer.from("collection_authority"),
      delegatePda.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const ix = await program.methods
    .mint()
    .accounts({
      bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
      bubblegumSigner,
      clock: SYSVAR_CLOCK_PUBKEY,
      collectionMasterEdition: COLLECTION_MASTER_EDITION,
      collectionMetadata: COLLECTION_METADATA,
      collectionMint: COLLECTION_MINT,
      collectionAuthorityRecord,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      merkleTree: MERKLE_TREE,
      nanoMachine: NANO_MACHINE,
      nanoMachineAuthority: new PublicKey(
        "3GKV1SPSchgMgKqJLEAgnJvLPoKT28GuHFTcPnRF7cGR"
      ),
      nftMinter: payer.publicKey,
      recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      treeAuthority: TREE_AUTHORITY,
    })
    .instruction();

  const tx = new Transaction().add(ix);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
    skipPreflight: true,
  });

  console.log("Compressed NFT minted!");
}
