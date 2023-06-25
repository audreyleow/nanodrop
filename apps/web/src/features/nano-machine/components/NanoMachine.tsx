import { Typography } from "@mui/material";

import ErrorPage from "@/common/components/ErrorPage";
import MintPage from "@/features/nano-machine/components/MintPage";
import useNanoMachine from "@/features/nano-machine/hooks/useNanoMachine";

export default function NanoMachine() {
  const {
    fetchNanoMachineError,
    fetchBackgroundImageError,
    fetchCollectionError,
  } = useNanoMachine();

  return (
    <>
      {fetchCollectionError ||
      fetchNanoMachineError ||
      fetchBackgroundImageError ? (
        <ErrorPage>
          {fetchNanoMachineError ? (
            <Typography variant="h6">Nano Machine not found.</Typography>
          ) : (
            <Typography variant="h6">
              Network error, please refresh the page.
            </Typography>
          )}
        </ErrorPage>
      ) : (
        <MintPage />
      )}
    </>
  );
}
