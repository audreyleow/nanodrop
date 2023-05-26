import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { program } from "./program";

const NANO_MACHINE = new PublicKey(
  "HTk9JDmPNE2JdxK7yebXoSeMxnFUgYwwWzkzCWgNDdRz" // 10 items
);

export async function fetchNanoMachine() {
  const nanoMachine = await program.account.nanoMachine.fetch(NANO_MACHINE);
  console.log("Nano machine account fetched successfully:", nanoMachine);
}
