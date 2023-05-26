import { Connection, PublicKey } from "@solana/web3.js";

export async function getAccountSize(
  connection: Connection,
  publicKey: PublicKey
) {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (accountInfo !== null) {
    const accountSize = accountInfo.data.length;
    console.log(`Account size: ${accountSize}`);
  } else {
    console.log("Account not found");
  }
}
