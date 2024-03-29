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

const COLLECTION_MINT = new PublicKey(
  "2uigdDvneqCveMF9KQqNxE9tX76seJAjqqDA7nw7EUzS"
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
  "metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid" // 10 items
);
const MERKLE_TREE = new PublicKey(
  "BiFKKFoTLh1wmr4UP8H3JgUPWbFaGtzuZxwoM7wZ956N"
);
const [TREE_AUTHORITY] = PublicKey.findProgramAddressSync(
  [MERKLE_TREE.toBuffer()],
  BUBBLEGUM_PROGRAM_ID
);

export async function initializeNanoMachine(
  connection: Connection,
  payer: Keypair
) {
  const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), NANO_MACHINE.toBuffer()],
    program.programId
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

  const ix = await program.methods
    .initialize({
      baseName: "Metacamp POAP #",
      symbol: "CAMP",
      creators: [
        {
          address: new PublicKey("JonasQ6kwFknJKQpVXbAs2d3fdVLy2DnXd13ynwhgV4"),
          percentageShare: 100,
          verified: false,
        },
      ],
      goLiveDate: new anchor.BN(Math.ceil(Date.now() / 1000)),
      baseUri:
        "https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/",
      backgroundImageUri:
        "https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/background.jpeg",
      itemsAvailable: new anchor.BN(100),
      price: new anchor.BN(0.0 * LAMPORTS_PER_SOL),
      sellerFeeBasisPoints: 200,
    })
    .accounts({
      authority: payer.publicKey,
      nanoMachine: NANO_MACHINE,
      collectionMasterEdition: COLLECTION_MASTER_EDITION,
      collectionMetadata: COLLECTION_METADATA,
      collectionMint: COLLECTION_MINT,
      collectionAuthorityRecord,
      nanoMachinePdaAuthority,
      merkleTree: MERKLE_TREE,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      treeAuthority: TREE_AUTHORITY,
      paymentMint: program.programId,
    })
    .instruction();

  const tx = new Transaction().add(ix);
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

  console.log(
    "Nano machine initialized successfully: ",
    NANO_MACHINE.toBase58()
  );
}
