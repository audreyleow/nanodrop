import { Router } from "itty-router";

import { generateTransaction, getMetadata } from "./services/mint.service";

interface Env {
	FEE_PAYER_KEYPAIR: string;
	RPC_ENDPOINT: string;
}

const router = Router();

router.get("/mint", () => {
	const response = getMetadata();

	return new Response(JSON.stringify(response), {
		headers: {
			"Content-Type": "application/json",
		},
	});
});

router.post("/mint", async (request, env: Env) => {
	if (request.json && request.query) {
		const json = await request.json();

		const response = await generateTransaction({
			collectionMint: request.query.collectionMint,
			creator: request.query.creator,
			merkleTree: request.query.merkleTree,
			nanoMachineId: request.query.nanoMachineId,
			minter: json.account,
			rpcEndpoint: env.RPC_ENDPOINT,
			feePayerKeypair: env.FEE_PAYER_KEYPAIR,
		});

		return new Response(JSON.stringify(response), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} else {
		return new Response("400, bad request!", { status: 400 });
	}
});

router.all("*", () => new Response("404, not found!", { status: 404 }));

const fetchHandler = { fetch: router.handle };
export default fetchHandler;
