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

  const { nft } = await metaplex.nfts().create(
    {
      isCollection: true,
      isMutable: true,
      name: "Metacamp POAP",
      symbol: "CAMP",
      uri: "https://files.nanodrop.it/metaMWNWwC39BVDkuhpLKCtt4nVfJfBkJucDpERFBid/collection.json",
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: new PublicKey("JonasQ6kwFknJKQpVXbAs2d3fdVLy2DnXd13ynwhgV4"),
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
