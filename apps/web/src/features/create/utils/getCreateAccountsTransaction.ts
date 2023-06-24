import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import {
  createApproveCollectionAuthorityInstruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
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
  SYSVAR_RENT_PUBKEY,
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
    nanoMachineKeypair,
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
  nanoMachineKeypair,
}: {
  connection: Connection;
  collectionName: string;
  metadataUrl: string;
  symbol: string;
  collectionMintKeypair: Keypair;
  walletAdapter: WalletContextState;
  nanoMachineKeypair: Keypair;
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

  const [metadata] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMintKeypair.publicKey.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  const [nanoMachinePdaAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from("nano_machine"), nanoMachineKeypair.publicKey.toBuffer()],
    NANODROP_PROGRAM_ID
  );
  const [collectionAuthorityRecord] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      collectionMintKeypair.publicKey.toBuffer(),
      Buffer.from("collection_authority"),
      nanoMachinePdaAuthority.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  );
  const approveCollectionAuthorityIx =
    createApproveCollectionAuthorityInstruction({
      collectionAuthorityRecord,
      metadata,
      mint: collectionMintKeypair.publicKey,
      newCollectionAuthority: nanoMachinePdaAuthority,
      payer: walletAdapter.publicKey,
      updateAuthority: walletAdapter.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
    });

  const createCollectionIxs = transactionBuilder.getInstructions();

  return [...createCollectionIxs, approveCollectionAuthorityIx];
}
