import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "@reach/router";

import useNanoMachine from "../hooks/useNanoMachine";

export default function AdditionalInformation() {
  const params = useParams();
  const { nanoMachine } = useNanoMachine(params.nanoMachineId);

  if (!nanoMachine) {
    return <Skeleton />;
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontWeight: 500,
          }}
        >
          Additional Information
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <InformationRow title="Secondary royalties">
          <Typography>{nanoMachine.sellerFeePercent}</Typography>
        </InformationRow>
        <InformationRow title="Creator">
          <Typography
            component="a"
            sx={{
              color: "#ffffff",
            }}
            href={`https://solscan.io/account/${nanoMachine.creator.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {nanoMachine.creator.toBase58().slice(0, 4) +
              ".." +
              nanoMachine.creator.toBase58().slice(-4)}
          </Typography>
        </InformationRow>
        <InformationRow title="Merkle tree">
          <Typography
            component="a"
            sx={{
              color: "#ffffff",
            }}
            href={`https://solscan.io/account/${nanoMachine.merkleTree.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {nanoMachine.merkleTree.toBase58().slice(0, 4) +
              ".." +
              nanoMachine.merkleTree.toBase58().slice(-4)}
          </Typography>
        </InformationRow>
        <InformationRow title="Collection">
          <Typography
            component="a"
            sx={{
              color: "#ffffff",
            }}
            href={`https://solscan.io/account/${nanoMachine.collectionMint.toBase58()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {nanoMachine.collectionMint.toBase58().slice(0, 4) +
              ".." +
              nanoMachine.collectionMint.toBase58().slice(-4)}
          </Typography>
        </InformationRow>
      </AccordionDetails>
    </Accordion>
  );
}

const InformationRow = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => (
  <Box
    sx={{
      py: 1,
    }}
  >
    <Typography
      variant="caption"
      sx={{
        display: "block",
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {title}
    </Typography>
    <>{children}</>
  </Box>
);
