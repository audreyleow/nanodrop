import ErrorPage from "@/features/nano-machine/components/ErrorPage";
import MintPage from "@/features/nano-machine/components/MintPage";
import useNanoMachine from "@/features/nano-machine/hooks/useNanoMachine";

export default function NanoMachine() {
  const {
    fetchCollectionMetadataError,
    fetchCollectionUriMetadataError,
    fetchNanoMachineError,
  } = useNanoMachine();

  return (
    <>
      {fetchCollectionMetadataError ||
      fetchCollectionUriMetadataError ||
      fetchNanoMachineError ? (
        <ErrorPage />
      ) : (
        <MintPage />
      )}
    </>
  );
}
