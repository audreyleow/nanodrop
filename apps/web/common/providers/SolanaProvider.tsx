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
      endpoint={import.meta.env.VITE_RPC_ENDPOINT!}
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
