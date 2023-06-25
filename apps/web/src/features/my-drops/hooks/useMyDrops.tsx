import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { use, useMemo } from "react";
import useSWR from "swr";

export default function useMyDrops() {
  const { publicKey } = useWallet();

  const swr = useSWR(
    !publicKey ? null : ["my-drops", publicKey.toBase58()],
    async () =>
      axios<{ nanoMachineId: string; createdAt: string; updatedAt: string }[]>(
        `/v1/nano-machines/${publicKey.toBase58()}`
      ).then((res) => res.data)
  );

  const sortedData = useMemo(
    () =>
      swr.data
        ? [...swr.data].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        : undefined,
    [swr.data]
  );

  const result = useMemo(
    () => ({
      ...swr,
      data: sortedData,
    }),
    [sortedData, swr]
  );

  return result;
}
