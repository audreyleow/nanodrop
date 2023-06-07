import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

import SolanaProvider from "@/common/providers/SolanaProvider";

import EmotionRootStyleRegistry from "./EmotionRootStyleRegistry";

export const metadata: Metadata = {
  title: "NanoDrop",
  description:
    "Create the perfect NFT launchpad experience with NanoDrop, showcasing unique and limited edition digital assets on the lightning-fast Solana blockchain. 🎉 Collect, trade, and showcase NFTs while enjoying low gas fees and optimal scalability. 🚀 Your NFT journey starts here! ✨",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EmotionRootStyleRegistry>
          <SolanaProvider>{children}</SolanaProvider>
        </EmotionRootStyleRegistry>
      </body>
    </html>
  );
}
