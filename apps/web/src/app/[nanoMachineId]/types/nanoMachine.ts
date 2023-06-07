import { PublicKey } from "@solana/web3.js";

export interface NanoMachine {
  id: PublicKey;
  creator: PublicKey;
  goLiveDate: Date | null;
  itemsAvailable: string;
  itemsRedeemed: string;
  displayPrice: string;
  collectionName: string;
  collectionImageUri: string;
  collectionDescription: string;
  collectionMint: PublicKey;
  collectionSize: string;
  paymentMint: PublicKey;
  merkleTree: PublicKey;
  sellerFeePercent: string;
  backgroundImageUri: string | null;
}
