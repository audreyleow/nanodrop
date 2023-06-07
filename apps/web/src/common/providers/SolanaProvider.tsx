import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

const wallets = [new SolflareWalletAdapter()];

export default function SolanaProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConnectionProvider
      endpoint={process.env.NEXT_PUBLIC_RPC_ENDPOINT}
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
