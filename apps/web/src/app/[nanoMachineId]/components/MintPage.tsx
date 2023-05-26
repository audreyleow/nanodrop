import { Box, Paper } from "@mui/material";
import { useParams } from "next/navigation";

import useNanoMachine from "../hooks/useNanoMachine";
import MintBackground from "./MintBackground";
import NanoMachineInfo from "./NanoMachineInfo";

export default function MintPage() {
  const params = useParams();
  const { nanoMachine } = useNanoMachine(params.nanoMachineId);

  return (
    <>
      {typeof window !== "undefined" && !!nanoMachine && (
        <MintBackground nanoMachine={nanoMachine} />
      )}
      <Box
        sx={(theme) => ({
          display: "flex",
          justifyContent: "flex-end",
          px: 16,
          pt: 4,
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
            maxWidth: "26rem",
            zIndex: 1,
          }}
        >
          <NanoMachineInfo />
        </Paper>
      </Box>
    </>
  );
}
