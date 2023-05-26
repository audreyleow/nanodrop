import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import fs from "fs";

import { IDL } from "../target/types/nanodrop";

const connection = new Connection("https://solana-mainnet-api.rpc-node.com", {
  commitment: "confirmed",
});

const keypairJson = JSON.parse(
  fs.readFileSync("./target/deploy/authority-keypair.json").toString()
);

export const program = new anchor.Program(
  IDL,
  new PublicKey("nano4T4ujob2vtabhnoiSmHdq4gawScPTwwhF5HSwPJ"),
  new anchor.AnchorProvider(connection, new anchor.Wallet(keypairJson), {
    commitment: "confirmed",
  })
);
