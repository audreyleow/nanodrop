import ErrorIcon from "@mui/icons-material/Error";
import { Box, Container } from "@mui/material";

import useNanoMachine from "../../features/nano-machine/hooks/useNanoMachine";

export default function ErrorPage({
  children,
}: {
  children?: React.ReactNode;
}) {
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
        {children}
      </Box>
    </Container>
  );
}
