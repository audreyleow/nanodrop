import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { getMintIx, IDL, NANODROP_PROGRAM_ID } from "@nanodrop/contracts";
import {
	Connection,
	Keypair,
	PublicKey,
	Transaction,
	TransactionMessage,
	VersionedTransaction,
} from "@solana/web3.js";

export const getMetadata = () => ({
	label: "NanoDrop",
	icon: "https://files.nanodrop.it/assets/icon.png",
});

export const generateTransaction = async ({
	collectionMint,
	creator,
	merkleTree,
	minter,
	nanoMachineId,
	feePayerKeypair,
	rpcEndpoint,
}: {
	nanoMachineId: string;
	collectionMint: string;
	merkleTree: string;
	creator: string;
	minter: string;
	rpcEndpoint: string;
	feePayerKeypair: string;
}) => {
	const connection = new Connection(rpcEndpoint, { commitment: "confirmed" });
	const keypair = Keypair.fromSecretKey(
		Uint8Array.from(JSON.parse(feePayerKeypair))
	);
	const program = new Program(
		IDL,
		NANODROP_PROGRAM_ID,
		new AnchorProvider(
			connection,
			{
				publicKey: keypair.publicKey,
				signAllTransactions: async (txs) =>
					txs.map((t) => {
						if (isVersionedTransaction(t)) {
							t.sign([keypair]);
						} else {
							t.partialSign(keypair);
						}
						return t;
					}),
				signTransaction: async (tx) => {
					if (isVersionedTransaction(tx)) {
						tx.sign([keypair]);
					} else {
						tx.partialSign(keypair);
					}

					return tx;
				},
			},
			{ commitment: "confirmed" }
		)
	);

	const mintIx = await getMintIx(program, {
		collectionMint: new PublicKey(collectionMint),
		creator: new PublicKey(creator),
		merkleTree: new PublicKey(merkleTree),
		minter: new PublicKey(minter),
		nanoMachineId: new PublicKey(nanoMachineId),
	});
	const { blockhash } = await program.provider.connection.getLatestBlockhash();
	const messageV0 = new TransactionMessage({
		payerKey: new PublicKey(keypair.publicKey),
		recentBlockhash: blockhash,
		instructions: [mintIx],
	}).compileToV0Message();
	const transaction = new VersionedTransaction(messageV0);
	transaction.sign([keypair]);

	const serializedTransaction = transaction.serialize();
	const base64 = Buffer.from(serializedTransaction).toString("base64");

	return {
		transaction: base64,
	};
};

const isVersionedTransaction = (
	tx: Transaction | VersionedTransaction
): tx is VersionedTransaction => {
	return "version" in tx;
};
