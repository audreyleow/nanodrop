import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { program } from "./program";

const NANO_MACHINE = new PublicKey(
  "metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid" // 10 items
);

export async function fetchNanoMachine() {
  const nanoMachine = await program.account.nanoMachine.fetch(NANO_MACHINE);
  console.log("Nano machine account fetched successfully:", nanoMachine);
}
