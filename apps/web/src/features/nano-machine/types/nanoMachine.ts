import { PublicKey } from "@solana/web3.js";

import { Phase } from "@/features/create/types/phase";

export interface NanoMachine {
  id: PublicKey;
  creator: PublicKey;
  itemsRedeemed: string;
  collectionName: string;
  collectionMint: string;
  backgroundImageUrl: string | null;
  currentPhase: FetchedPhase & {
    phaseImageUrl: string;
    hasMintStarted: boolean;
  };
}

export interface FetchedPhase {
  name: string;
  metadata: string;
  startDate: Date;
}
