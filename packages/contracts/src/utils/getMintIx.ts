import { Program } from "@coral-xyz/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from "@solana/web3.js";

import { Nanodrop } from "../../target/types/nanodrop";
import { NANODROP_PROGRAM_ID } from "../constants/nanodropProgramId";

const BUBBLEGUM_PROGRAM_ID = new PublicKey(
  "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY"
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const SPL_ACCOUNT_COMPRESSION_PROGRAM_ID = new PublicKey(
  "cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK"
);
const SPL_NOOP_PROGRAM_ID = new PublicKey(
  "noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV"
);

export async function getMintIx(
  program: Program<Nanodrop>,
  {
    nanoMachineId,
    collectionMint,
    creator,
    merkleTree,
    minter,
  }: {
    nanoMachineId: PublicKey;
    collectionMint: PublicKey;
    merkleTree: PublicKey;
    creator: PublicKey;
    minter: PublicKey;
  }
) {
  const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), nanoMachineId.toBuffer()],
    NANODROP_PROGRAM_ID
  );

  const [collectionMetadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const [collectionMasterEdition] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
      Buffer.from("edition"),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMint.toBuffer(),
      Buffer.from("collection_authority"),
      nanoMachinePdaAuthority.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );

  const [treeAuthority] = PublicKey.findProgramAddressSync(
    [merkleTree.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  const [bubblegumSigner] = PublicKey.findProgramAddressSync(
    [Buffer.from("collection_cpi")],
    BUBBLEGUM_PROGRAM_ID
  );

  const mintIx = await program.methods
    .mint()
    .accounts({
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
      bubblegumSigner,
      clock: SYSVAR_CLOCK_PUBKEY,
      collectionAuthorityRecord,
      collectionMasterEdition,
      collectionMetadata,
      collectionMint,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      merkleTree,
      nanoMachine: nanoMachineId,
      nanoMachineAuthority: creator,
      nanoMachineAuthorityAta: NANODROP_PROGRAM_ID,
      nanoMachinePdaAuthority,
      nftMinter: minter,
      nftMinterAta: NANODROP_PROGRAM_ID,
      paymentMint: NANODROP_PROGRAM_ID,
      recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
      tokenProgram: TOKEN_PROGRAM_ID,
      treeAuthority,
    })
    .instruction();

  return mintIx;
}
