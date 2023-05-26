import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  createAllocTreeIx,
  getConcurrentMerkleTreeAccountSize,
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
} from "@solana/spl-account-compression";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

const MAX_DEPTH_SIZE_PAIR: ValidDepthSizePair = {
  // max=8 nodes
  maxDepth: 3,
  maxBufferSize: 8,

  // max=32 nodes
  // maxDepth: 5,
  // maxBufferSize: 8,

  // max=16,384 nodes
  // maxDepth: 14,
  // maxBufferSize: 64,

  // max=131,072 nodes
  // maxDepth: 17,
  // maxBufferSize: 64,

  // max=1,048,576 nodes
  // maxDepth: 20,
  // maxBufferSize: 256,

  // max=1,073,741,824 nodes
  // maxDepth: 30,
  // maxBufferSize: 2048,
};
const canopyDepth = MAX_DEPTH_SIZE_PAIR.maxDepth - 3;

export async function createTree(connection: Connection, payer: Keypair) {
  const treeKeypair = Keypair.generate();

  console.log("Creating a new Merkle tree...");

  // derive the tree's authority (PDA), owned by Bubblegum
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [treeKeypair.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );

  // const requiredSpace = getConcurrentMerkleTreeAccountSize(
  //   MAX_DEPTH_SIZE_PAIR.maxDepth,
  //   MAX_DEPTH_SIZE_PAIR.maxBufferSize,
  //   canopyDepth
  // );

  // const storageCost = await connection.getMinimumBalanceForRentExemption(
  //   requiredSpace
  // );

  // console.log("Space to allocate:", requiredSpace, "bytes");
  // console.log(
  //   "Estimated cost to allocate space:",
  //   storageCost / LAMPORTS_PER_SOL
  // );
  // console.log(
  //   "Max compressed NFTs for tree:",
  //   Math.pow(2, MAX_DEPTH_SIZE_PAIR.maxDepth),
  //   "\n"
  // );
  // return;

  // allocate the tree's account on chain with the `space`
  // NOTE: this will compute the space needed to store the tree on chain (and the lamports required to store it)
  const allocTreeIx = await createAllocTreeIx(
    connection,
    treeKeypair.publicKey,
    payer.publicKey,
    MAX_DEPTH_SIZE_PAIR,
    canopyDepth
  );

  // create the instruction to actually create the tree
  const createTreeIx = createCreateTreeInstruction(
    {
      payer: payer.publicKey,
      treeCreator: payer.publicKey,
      treeAuthority,
      merkleTree: treeKeypair.publicKey,
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      // NOTE: this is used for some on chain logging
      logWrapper: SPL_NOOP_PROGRAM_ID,
    },
    {
      maxBufferSize: MAX_DEPTH_SIZE_PAIR.maxBufferSize,
      maxDepth: MAX_DEPTH_SIZE_PAIR.maxDepth,
      public: false,
    },
    BUBBLEGUM_PROGRAM_ID
  );

  // create and send the transaction to initialize the tree
  const tx = new Transaction().add(allocTreeIx).add(createTreeIx);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(
    connection,
    tx,
    // ensuring the `treeKeypair` PDA and the `payer` are BOTH signers
    [treeKeypair, payer],
    {
      commitment: "confirmed",
      skipPreflight: true,
    }
  );

  console.log(
    "\nMerkle tree created successfully!",
    treeKeypair.publicKey.toBase58()
  );

  // return useful info
  return { treeAuthority, treeAddress: treeKeypair.publicKey };
}
