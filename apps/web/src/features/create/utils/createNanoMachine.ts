import { PublicKey } from "@solana/web3.js";
import axios from "axios";

import { Phase } from "../types/phase";

export default async function createNanoMachine({
  nanoMachineId,
  user,
  phases,
  backgroundImageUrl,
}: {
  nanoMachineId: PublicKey;
  user: PublicKey;
  phases: Phase[];
  backgroundImageUrl: string | null;
}) {
  await createUser(user);

  const result = await axios.post("/v1/nano-machines", {
    nanoMachineId: nanoMachineId.toBase58(),
    user: user.toBase58(),
    phases: phases.map((phase, index) => ({
      startDate: phase.startDate,
      nftName: phase.name,
      index,
    })),
    ...(backgroundImageUrl && { backgroundImageUrl }),
  });

  return result.data;
}

async function createUser(user: PublicKey) {
  try {
    const result = await axios.post("/v1/users", {
      publicKey: user.toBase58(),
    });
    return result.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // ignore user already exists error
      return error.response.data;
    }

    throw error;
  }
}
