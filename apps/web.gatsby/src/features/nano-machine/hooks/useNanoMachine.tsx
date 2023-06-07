import {
  Metadata,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { Buffer } from "buffer";
import Decimal from "decimal.js";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import useSWRSubscription from "swr/subscription";

import useNanodrop from "../../../common/hooks/useNanodrop";
import type { NanoMachine } from "../types/nanoMachine";

export default function useNanoMachine(nanoMachineId: string) {
  const { connection } = useConnection();
  const { nanoMachineData, fetchNanoMachineError, mutate } =
    useNanoMachineData(nanoMachineId);

  const { data: collectionMetadata, error: fetchCollectionMetadataError } =
    useSWR(
      typeof window === "undefined" || nanoMachineData === undefined
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
        const [collectionMetadata] = Metadata.deserialize(accountInfo.data);
        return collectionMetadata;
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
    if (!nanoMachineData || !collectionMetadata || !collectionUriMetadata) {
      return undefined;
    } else {
      const decimals = 9; // TODO: currently only supporting SOL
      const displayPrice = new Decimal(nanoMachineData.price.toString())
        .div(10 ** decimals)
        .toFixed();

      const backgroundImageUri =
        nanoMachineData.backgroundImageUri.replaceAll("\u0000", "").trim()
          .length === 0
          ? null
          : nanoMachineData.backgroundImageUri.replaceAll("\u0000", "").trim();

      return {
        id: new PublicKey(nanoMachineId),
        creator: nanoMachineData.authority,
        collectionImageUri: collectionUriMetadata.image ?? "",
        collectionName: collectionUriMetadata.name ?? "",
        collectionDescription: collectionUriMetadata.description ?? "",
        collectionMint: nanoMachineData.collectionMint,
        collectionSize: collectionMetadata.collectionDetails.size.toString(),
        displayPrice,
        goLiveDate:
          nanoMachineData.goLiveDate === null
            ? null
            : new Date(nanoMachineData.goLiveDate.toNumber() * 1000),
        itemsAvailable: nanoMachineData.itemsAvailable.toString(),
        itemsRedeemed: nanoMachineData.itemsRedeemed.toString(),
        paymentMint: nanoMachineData.paymentMint,
        merkleTree: nanoMachineData.merkleTree,
        sellerFeePercent: nanoMachineData.sellerFeeBasisPoints / 100 + "%",
        backgroundImageUri,
      };
    }
  }, [
    collectionMetadata,
    collectionUriMetadata,
    nanoMachineData,
    nanoMachineId,
  ]);

  return {
    nanoMachine,
    fetchNanoMachineError,
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    mutate,
  };
}

const useNanoMachineData = (nanoMachineId: string) => {
  const program = useNanodrop();
  const [nanoMachineData, setNanoMachineData] =
    useState<Awaited<ReturnType<typeof program.account.nanoMachine.fetch>>>();

  const {
    data: fetchedNanoMachine,
    error: fetchNanoMachineError,
    mutate,
  } = useSWR(
    typeof window === "undefined" ? null : nanoMachineId,
    (nanoMachineId) => program.account.nanoMachine.fetch(nanoMachineId)
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
