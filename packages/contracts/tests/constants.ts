import * as anchor from "@coral-xyz/anchor";
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID } from "@metaplex-foundation/mpl-bubblegum";
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
} from "@solana/spl-account-compression";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_SLOT_HASHES_PUBKEY,
} from "@solana/web3.js";
import fs from "fs";

import { IDL, Nanodrop } from "../target/types/nanodrop";

const CONNECTION = new Connection(
  "https://warmhearted-solemn-shard.solana-mainnet.discover.quiknode.pro/ba1621153f9558a7ef443c254761d8667036320f",
  {
    commitment: "confirmed",
  }
);

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

const MERKLE_TREE = new PublicKey(
  "CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR" // 2 ^ 14 nodes, creator: testJc1yYCFZv4iFcSxdjcMcjFcAZNKE1eFoEu39f1T
);
const [TREE_AUTHORITY] = PublicKey.findProgramAddressSync(
  [MERKLE_TREE.toBuffer()],
  BUBBLEGUM_PROGRAM_ID
);

const TREE_WITH_WRONG_CREATOR = new PublicKey(
  "9D8h24LeWyEPQoCotoCGdioh1UiKEbjusPhnr1rSCc2g"
); // creator: GxPmKswVZ1Fc96HJfFhUwJYUCHFFetekxCH3kRLiXxJ3
const [TREE_WITH_WRONG_CREATOR_AUTHORITY] = PublicKey.findProgramAddressSync(
  [MERKLE_TREE.toBuffer()],
  BUBBLEGUM_PROGRAM_ID
);

const NANO_MACHINE_AUTHORITY = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync("./target/deploy/test-authority-keypair.json").toString()
    )
  )
);

const PROGRAM = new anchor.Program(
  IDL,
  new PublicKey("testJc1yYCFZv4iFcSxdjcMcjFcAZNKE1eFoEu39f1T"),
  new anchor.AnchorProvider(
    CONNECTION,
    new anchor.Wallet(NANO_MACHINE_AUTHORITY),
    {
      commitment: "confirmed",
    }
  )
) as anchor.Program<Nanodrop>;

const MINTER = Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(fs.readFileSync("./target/deploy/test-minter.json").toString())
  )
);

const USDC_ADDRESS = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

const MSOL_ADDRESS = new PublicKey(
  "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"
);

const NANO_MACHINE_AUTHORITY_USDC_ATA = getAssociatedTokenAddressSync(
  USDC_ADDRESS,
  NANO_MACHINE_AUTHORITY.publicKey
);

const MINTER_MSOL_ATA = getAssociatedTokenAddressSync(
  MSOL_ADDRESS,
  MINTER.publicKey
);

const INITIALIZATION_ARGS = {
  baseName: "Number #",
  symbol: "NB",
  creators: [
    {
      address: NANO_MACHINE_AUTHORITY.publicKey,
      percentageShare: 100,
      verified: false,
    },
  ],
  goLiveDate: new anchor.BN(Math.ceil(Date.now() / 1000)),
  baseUri:
    "https://bafybeibbod7vhiipslfuymeqq2cztaf2yizaud4h54okgpbc2ywpwanzve.ipfs.cf-ipfs.com/",
  backgroundImageUri:
    "https://bafybeifr36xlj6cytufp63vvvnzqkfdkcr4udyiz6ahc3ufnicx7vvpate.ipfs.cf-ipfs.com/",
  itemsAvailable: new anchor.BN(1),
  price: new anchor.BN(0),
  sellerFeeBasisPoints: 100,
};

const INIT_BASE_ACCOUNTS = {
  collectionMasterEdition: COLLECTION_MASTER_EDITION,
  collectionMetadata: COLLECTION_METADATA,
  collectionMint: COLLECTION_MINT,
  systemProgram: SystemProgram.programId,
  rent: SYSVAR_RENT_PUBKEY,
  sysvarInstructions: SYSVAR_INSTRUCTIONS_PUBKEY,
  tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
  paymentMint: PROGRAM.programId,
};

const [BUBBLEGUM_SIGNER] = PublicKey.findProgramAddressSync(
  [Buffer.from("collection_cpi")],
  BUBBLEGUM_PROGRAM_ID
);
const MINT_BASE_ACCOUNTS = {
  collectionMasterEdition: COLLECTION_MASTER_EDITION,
  collectionMetadata: COLLECTION_METADATA,
  collectionMint: COLLECTION_MINT,
  nanoMachineAuthority: NANO_MACHINE_AUTHORITY.publicKey,
  nftMinter: MINTER.publicKey,
  treeAuthority: TREE_AUTHORITY,
  merkleTree: MERKLE_TREE,
  bubblegumSigner: BUBBLEGUM_SIGNER,
  clock: SYSVAR_CLOCK_PUBKEY,
  associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
  bubblegumProgram: BUBBLEGUM_PROGRAM_ID,
  recentSlothashes: SYSVAR_SLOT_HASHES_PUBKEY,
  systemProgram: SystemProgram.programId,
  tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
  compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  logWrapper: SPL_NOOP_PROGRAM_ID,
  tokenProgram: TOKEN_PROGRAM_ID,
};

export {
  COLLECTION_MASTER_EDITION,
  COLLECTION_METADATA,
  COLLECTION_MINT,
  CONNECTION,
  INIT_BASE_ACCOUNTS,
  INITIALIZATION_ARGS,
  MERKLE_TREE,
  MINT_BASE_ACCOUNTS,
  MINTER,
  MINTER_MSOL_ATA,
  MSOL_ADDRESS,
  NANO_MACHINE_AUTHORITY,
  NANO_MACHINE_AUTHORITY_USDC_ATA,
  PROGRAM,
  TREE_AUTHORITY,
  TREE_WITH_WRONG_CREATOR,
  TREE_WITH_WRONG_CREATOR_AUTHORITY,
  USDC_ADDRESS,
};
