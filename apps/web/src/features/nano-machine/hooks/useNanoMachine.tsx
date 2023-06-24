import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

import useNanodrop from "@/common/hooks/useNanodrop";

import type { NanoMachine } from "../types/nanoMachine";
import useCurrentPhase from "./useCurrentPhase";

export default function useNanoMachine() {
  const { nanoMachineId } = useParams();

  const { connection } = useConnection();
  const { nanoMachineData, fetchNanoMachineError, mutate } = useNanoMachineData(
    typeof nanoMachineId === "string" ? nanoMachineId : undefined
  );
  const {
    data: backgroundImageUrl,
    error: fetchBackgroundImageError,
    isLoading: isBackgroundImageLoading,
  } = useBackgroundImageUri(nanoMachineId, nanoMachineData?.creator);

  const phases = useMemo(
    () =>
      nanoMachineData?.phases.map((phase) => ({
        name: phase.nftName,
        startDate: new Date(phase.startDate.toNumber() * 1000),
        metadata: `https://files.nanodrop.it/${nanoMachineId}/${phase.index}.json`,
      })),
    [nanoMachineData?.phases, nanoMachineId]
  );
  const currentPhase = useCurrentPhase(phases);

  const { data: collectionMetadata, error: fetchCollectionMetadataError } =
    useSWR(
      nanoMachineData === undefined
        ? null
        : nanoMachineData.collectionMint.toBase58(),
      async (collectionMint) => {
        const [collectionMetadataId] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            new PublicKey(collectionMint).toBuffer(),
          ],
          TOKEN_METADATA_PROGRAM_ID
        );
        const accountInfo = await connection.getAccountInfo(
          collectionMetadataId
        );

        if (accountInfo) {
          const [collectionMetadata] = Metadata.deserialize(accountInfo.data);
          return collectionMetadata;
        }
      }
    );

  const {
    data: collectionUriMetadata,
    error: fetchCollectionUriMetadataError,
  } = useSWR(
    typeof window === "undefined" || collectionMetadata === undefined
      ? null
      : collectionMetadata.data.uri.replaceAll("\u0000", ""),
    async (collectionMetadataUri) =>
      axios
        .get<{
          description: string | undefined;
          image: string | undefined;
          name: string | undefined;
        }>(collectionMetadataUri)
        .then((response) => response.data)
  );

  const nanoMachine: NanoMachine | undefined = useMemo(() => {
    if (
      !nanoMachineData ||
      !collectionMetadata ||
      !collectionUriMetadata ||
      !collectionMetadata?.collectionDetails ||
      isBackgroundImageLoading ||
      !currentPhase ||
      typeof nanoMachineId !== "string"
    ) {
      return undefined;
    } else {
      return {
        id: new PublicKey(nanoMachineId),
        creator: nanoMachineData.creator,
        collectionName: collectionUriMetadata.name ?? "",
        itemsRedeemed: nanoMachineData.itemsRedeemed.toString(),
        backgroundImageUrl,
        collectionMint: nanoMachineData.collectionMint.toBase58(),
        currentPhase,
      };
    }
  }, [
    backgroundImageUrl,
    collectionMetadata,
    collectionUriMetadata,
    currentPhase,
    isBackgroundImageLoading,
    nanoMachineData,
    nanoMachineId,
  ]);

  return {
    nanoMachine,
    fetchNanoMachineError,
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    fetchBackgroundImageError,
    mutate,
  };
}

const useNanoMachineData = (nanoMachineId?: string) => {
  const program = useNanodrop();
  const [nanoMachineData, setNanoMachineData] =
    useState<Awaited<ReturnType<typeof program.account.nanoMachine.fetch>>>();

  const {
    data: fetchedNanoMachine,
    error: fetchNanoMachineError,
    mutate,
  } = useSWR(nanoMachineId ?? null, (nanoMachineId) =>
    program.account.nanoMachine.fetch(nanoMachineId)
  );

  const { data: subscribedNanoMachine } = useSWRSubscription(
    nanoMachineId,
    (nanoMachineId, { next }) => {
      try {
        const emitter = program.account.nanoMachine.subscribe(
          nanoMachineId,
          "confirmed"
        );

        const onChange = (nanoMachine: any) => {
          next(null, nanoMachine);
        };
        emitter.addListener("change", onChange);

        return () => {
          emitter.removeListener("change", onChange);
        };
      } catch {
        // ignore errors as they are handled by the fetchNanoMachineError
        return () => {};
      }
    }
  );

  useEffect(
    function updateNanoMachineData() {
      if (subscribedNanoMachine) {
        setNanoMachineData(subscribedNanoMachine);
      } else if (fetchedNanoMachine) {
        setNanoMachineData(fetchedNanoMachine);
      }
    },
    [fetchedNanoMachine, subscribedNanoMachine]
  );

  return { nanoMachineData, fetchNanoMachineError, mutate };
};

const useBackgroundImageUri = (
  nanoMachineId: string,
  creator: PublicKey | undefined
) => {
  const swr = useSWR(
    creator === undefined ? null : [nanoMachineId, creator.toBase58()],
    async ([nanoMachineId, creator]) =>
      axios
        .get<{ backgroundImageUrl?: string }>(
          `/v1/nano-machines/${creator}/${nanoMachineId}`
        )
        .then((response) => response.data.backgroundImageUrl ?? null)
  );

  return swr;
};
