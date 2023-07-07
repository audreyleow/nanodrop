import { Box } from "@mui/material";

import SolanaPayQr from "./SolanaPayQr";

const styles = {
  logo: {
    width: "100%",
    height: "100%",
    color: "grey.500",
  },
};

export default function NanoMachineInfo() {
  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <SolanaPayQr />
    </Box>
  );
}
