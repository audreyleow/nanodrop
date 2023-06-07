import ErrorIcon from "@mui/icons-material/Error";
import { Box, Container, Typography } from "@mui/material";
import { useParams } from "@reach/router";
import * as React from "react";

import useNanoMachine from "../hooks/useNanoMachine";

export default function ErrorPage() {
  const params = useParams();
  const { fetchNanoMachineError } = useNanoMachine(params.nanoMachineId);

  return (
    <Container
      fixed
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
        }}
      >
        <ErrorIcon fontSize="large" />
        {fetchNanoMachineError ? (
          <Typography variant="h6">Nano Machine not found.</Typography>
        ) : (
          <Typography variant="h6">
            Network error, please refresh the page.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
