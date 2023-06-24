import {
  Avatar,
  Box,
  CircularProgress,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useNanoMachine from "../hooks/useNanoMachine";

const styles = {
  logo: {
    width: "100%",
    height: "100%",
    color: "grey.500",
  },
};

export default function NanoMachineInfo() {
  const { nanoMachine } = useNanoMachine();

  return (
    <>
      <AspectRatioBox aspectHeight={1} aspectWidth={1}>
        <Avatar
          variant="rounded"
          src={nanoMachine?.currentPhase.phaseImageUrl}
          sx={styles.logo}
        >
          <CircularProgress color="inherit" />
        </Avatar>
      </AspectRatioBox>
      <Box
        sx={{
          p: 8,
          pb: 5,
          "&& > *": {
            mb: 2,
          },
        }}
      >
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "2.5rem" }} />
        ) : (
          <Typography variant="h4" fontWeight="500">
            {nanoMachine.currentPhase.name}
          </Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.5rem" }} />
        ) : (
          <Typography>{nanoMachine.collectionName}</Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.25rem" }} />
        ) : (
          <Typography variant="body2">
            Created by:{" "}
            <Link
              href={`https://solscan.io/account/${nanoMachine.creator.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nanoMachine.creator.toBase58().slice(0, 4)}..
              {nanoMachine.creator.toBase58().slice(-4)}
            </Link>
          </Typography>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "1.25rem" }} />
        ) : (
          <Typography variant="body2">
            Items minted: {nanoMachine.itemsRedeemed}
          </Typography>
        )}
      </Box>
    </>
  );
}
