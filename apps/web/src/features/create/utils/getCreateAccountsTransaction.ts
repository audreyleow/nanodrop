import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import {
  getSpaceForNanoMachine,
  NANODROP_PROGRAM_ID,
} from "@nanodrop/contracts";
import { WalletContextState } from "@solana/wallet-adapter-react";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

export default async function getCreateAccountsTransaction({
  collectionName,
  connection,
  metadataUrl,
  nanoMachineKeypair,
  phasesCount,
  symbol,
  walletAdapter,
  collectionMintKeypair,
}: {
  connection: Connection;
  collectionName: string;
  metadataUrl: string;
  symbol: string;
  walletAdapter: WalletContextState;
  phasesCount: number;
  nanoMachineKeypair: Keypair;
  collectionMintKeypair: Keypair;
}) {
  const createNanoMachineAccountIx = await createCreateNanoMachineAccountIx({
    connection,
    phasesCount,
    nanoMachineKeypair,
    walletAdapter,
  });

  const createCollectionIxs = await createCreateCollectionIxs({
    connection,
    collectionName,
    metadataUrl,
    symbol,
    walletAdapter,
    collectionMintKeypair,
  });

  const blockhash = await connection
    .getLatestBlockhash()
    .then((res) => res.blockhash);
  const messageV0 = new TransactionMessage({
    instructions: [createNanoMachineAccountIx, ...createCollectionIxs],
    payerKey: walletAdapter.publicKey,
    recentBlockhash: blockhash,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(messageV0);

  return transaction;
}

export async function createCreateNanoMachineAccountIx({
  phasesCount,
  walletAdapter,
  connection,
  nanoMachineKeypair,
}: {
  walletAdapter: WalletContextState;
  connection: Connection;
  phasesCount: number;
  nanoMachineKeypair: Keypair;
}) {
  const size = getSpaceForNanoMachine(phasesCount);

  const ix = SystemProgram.createAccount({
    fromPubkey: walletAdapter.publicKey,
    newAccountPubkey: nanoMachineKeypair.publicKey,
    space: size,
    lamports: await connection.getMinimumBalanceForRentExemption(size),
    programId: NANODROP_PROGRAM_ID,
  });

  return ix;
}

async function createCreateCollectionIxs({
  connection,
  collectionName,
  metadataUrl,
  symbol,
  collectionMintKeypair,
  walletAdapter,
}: {
  connection: Connection;
  collectionName: string;
  metadataUrl: string;
  symbol: string;
  collectionMintKeypair: Keypair;
  walletAdapter: WalletContextState;
}) {
  const metaplex = Metaplex.make(connection).use(
    walletAdapterIdentity(walletAdapter)
  );
  const transactionBuilder = await metaplex
    .nfts()
    .builders()
    .create({
      useNewMint: collectionMintKeypair,
      isCollection: true,
      isMutable: true,
      name: collectionName,
      symbol,
      uri: metadataUrl,
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: walletAdapter.publicKey,
          share: 100,
        },
      ],
    });

  const ixs = transactionBuilder.getInstructions();

  return ixs;
}
