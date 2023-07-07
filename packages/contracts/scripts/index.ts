import { PublicKey } from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import fs from "fs";

import { createNanoMachineAccount } from "../tests/create-nano-machine-account";
import { approveCollectionAuthority } from "./approve-collection-authority";
import { checkCollectionAuthorityRecord } from "./check-collection-authority-record";
import { closeNanoMachine } from "./close-nano-machine";
import { createCollection } from "./create-collection";
import { createTree } from "./create-tree";
import { fetchNanoMachine } from "./fetch-nanomachine";
import { getAccountSize } from "./get-account-size";
import { getTreeInfo } from "./get-tree-info";
import { initializeNanoMachine } from "./initialize-nano-machine";
import { mintFromNanoMachine } from "./mint-from-nano-machine";
import { program } from "./program";
import { setTreeDelegate } from "./set-tree-delegate";
import { setup } from "./setup";
import { updateNanoMachine } from "./update-nano-machine";

const connection = new Connection("", {
  commitment: "confirmed",
});

const keypairJson = JSON.parse(
  fs.readFileSync("./target/deploy/test-authority-keypair.json").toString()
);

const prodKeypairJson = JSON.parse(
  fs.readFileSync("./target/deploy/authority-keypair.json").toString()
);

const testMinterKeypairJson = JSON.parse(
  fs.readFileSync("./target/deploy/test-minter.json").toString()
);

const keypair = Keypair.fromSecretKey(Uint8Array.from(prodKeypairJson));

// setup(connection, keypair);

// checkCollectionAuthorityRecord(
//   new PublicKey("FKCK5bxzNbQNqrGUx1tbzG1u4HHNvznNAiSJhTQPm8Rd"),
//   connection
// );

// createCollection(connection, keypair);

approveCollectionAuthority(connection, keypair);

// createNanoMachineAccount(keypair, program.programId, 100);

// createTree(connection, keypair);

// getTreeInfo(
//   connection,
//   new PublicKey("CeQFpf5USvUFkfLjvSwr5RjFA3CqCjYjGJMuQaG2bYBR")
// );

// setTreeDelegate(connection, keypair).catch((e) => {
//   console.log(e);
// });

// initializeNanoMachine(connection, keypair).catch((e) => {
//   console.log(e);
// });

// fetchNanoMachine();

// mintFromNanoMachine(connection, keypair).catch((e) => {
//   console.log(e);
// });

// updateNanoMachine(connection, keypair).catch((e) => {
//   console.log(e);
// });

// closeNanoMachine(connection, keypair).catch((e) => {
//   console.log(e);
// });

// getAccountSize(
//   connection,
//   new PublicKey("8XrvMvQd9se63ftD9gZsAgQ4TSdkh5VYvt1rCRMz8M43")
// );
