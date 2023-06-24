import {
  createSetTreeDelegateInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";

import { program } from "./program";

const MERKLE_TREE = new PublicKey(
  "CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR"
);
const [TREE_AUTHORITY] = PublicKey.findProgramAddressSync(
  [MERKLE_TREE.toBuffer()],
  BUBBLEGUM_PROGRAM_ID
);

export async function setTreeDelegate(connection: Connection, payer: Keypair) {
  const [config] = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  );

  const ix = createSetTreeDelegateInstruction({
    merkleTree: MERKLE_TREE,
    newTreeDelegate: config,
    treeAuthority: TREE_AUTHORITY,
    treeCreator: payer.publicKey,
  });
  const tx = new Transaction().add(ix);
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  tx.feePayer = payer.publicKey;
  tx.sign(payer);

  const txId = await connection.sendRawTransaction(tx.serialize());

  await connection.confirmTransaction(txId, "confirmed");

  console.log(`https://solscan.io/tx/${txId}`);
}
