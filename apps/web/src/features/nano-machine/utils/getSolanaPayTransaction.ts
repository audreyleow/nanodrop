import { findReference, FindReferenceError } from "@solana/pay";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Dispatch, SetStateAction } from "react";

export default async function getSolanaPayTransaction(
  connection: Connection,
  reference: PublicKey
) {
  try {
    const confirmedSignatureInfo = await findReference(connection, reference, {
      finality: "confirmed",
    });

    return confirmedSignatureInfo.signature;
  } catch (e) {
    // If current reference not found, ignore error
    if (e instanceof FindReferenceError) {
      return;
    } else {
      console.error(e);
    }
  }
}
