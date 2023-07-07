import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
  PublicKey,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

export async function createCollection(connection: Connection, payer: Keypair) {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(bundlrStorage());

  const mint = Keypair.fromSecretKey(Uint8Array.from([]));

  const { nft } = await metaplex.nfts().create(
    {
      isCollection: true,
      isMutable: true,
      name: "NanoDrop SOAP",
      symbol: "SOAP",
      uri: "https://files.nanodrop.it/assets/nanodrop-collection.json",
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: new PublicKey("drop3XQiPXyj2XUCF94WeCJV6xRKyqBStUcc8nB2ZeN"),
          share: 100,
        },
      ],
      useNewMint: mint,
    },
    {
      confirmOptions: {
        skipPreflight: true,
      },
    }
  );

  console.log(nft.address.toBase58());
}
