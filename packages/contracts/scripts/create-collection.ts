import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";

export async function createCollection(connection: Connection, payer: Keypair) {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(payer))
    .use(bundlrStorage());

  const { nft } = await metaplex.nfts().create(
    {
      isCollection: true,
      isMutable: true,
      name: "Metacamp Builders League NFT",
      symbol: "METACAMP",
      uri: "https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/collection.json",
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: payer.publicKey,
          share: 100,
        },
      ],
    },
    {
      confirmOptions: {
        skipPreflight: true,
      },
    }
  );

  console.log(nft.address.toBase58());
}
