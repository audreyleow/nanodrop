import { Box, Paper } from "@mui/material";
import dynamic from "next/dynamic";

import useNanoMachine from "../hooks/useNanoMachine";
import NanoMachineInfo from "./NanoMachineInfo";
import SolanaPayQr from "./SolanaPayQr";

const MintBackground = dynamic(() => import("./MintBackground"), {
  ssr: false,
});

export default function MintPage() {
  const { nanoMachine } = useNanoMachine();

  return (
    <>
      {typeof window !== "undefined" && !!nanoMachine && (
        <MintBackground nanoMachine={nanoMachine} />
      )}
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "center",
          px: 16,
          pt: 8,
          pb: 8,
          [theme.breakpoints.down("md")]: {
            justifyContent: "center",
            px: 4,
          },
        })}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: "20rem",
            zIndex: 1,
          }}
        >
          <NanoMachineInfo />
        </Paper>
      </Box>
    </>
  );
}
