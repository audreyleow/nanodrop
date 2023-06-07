import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import React from "react";

const wallets = [new SolflareWalletAdapter()];

export default function SolanaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConnectionProvider
      endpoint={process.env.GATSBY_RPC_ENDPOINT!}
      config={{
        commitment: "confirmed",
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <>{children}</>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
