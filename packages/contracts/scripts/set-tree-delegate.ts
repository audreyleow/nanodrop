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

export async function setTreeDelegate(connection: Connection, payer: Keypair) {
  const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), NANO_MACHINE.toBuffer()],
    program.programId
  );

  const ix = createSetTreeDelegateInstruction({
    merkleTree: MERKLE_TREE,
    newTreeDelegate: nanoMachinePdaAuthority,
    treeAuthority: TREE_AUTHORITY,
    treeCreator: payer.publicKey,
  });
  const tx = new Transaction().add(ix);
  tx.feePayer = payer.publicKey;

  // send the transaction
  await sendAndConfirmTransaction(connection, tx, [payer], {
    commitment: "confirmed",
    skipPreflight: true,
  });

  console.log(
    "\nMerkle tree delegate set successfully!",
    nanoMachinePdaAuthority.toBase58()
  );
}
