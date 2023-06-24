import { CollectionAuthorityRecord } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, PublicKey } from "@solana/web3.js";

export const checkCollectionAuthorityRecord = async (
  authorityRecord: PublicKey,
  connection: Connection
) => {
  const data = await connection.getAccountInfo(authorityRecord);
  console.log(CollectionAuthorityRecord.deserialize(data.data));
};
