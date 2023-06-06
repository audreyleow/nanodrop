"use client";

import { useParams } from "next/navigation";

import ErrorPage from "./components/ErrorPage";
import MintPage from "./components/MintPage";
import useNanoMachine from "./hooks/useNanoMachine";

export default function Page() {
  const params = useParams();
  const {
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    fetchNanoMachineError,
  } = useNanoMachine(params.nanoMachineId);

  if (
    fetchCollectionMetadataError ||
    fetchCollectionUriMetadataError ||
    fetchNanoMachineError
  ) {
    return <ErrorPage />;
  }

  return <MintPage />;
}
