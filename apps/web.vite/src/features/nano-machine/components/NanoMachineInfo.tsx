import {
  Avatar,
  Box,
  CircularProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import { useParams } from "@reach/router";

import AspectRatioBox from "../../..//common/components/AspectRatioBox";
import SolanaLogo from "../../../common/components/SolanaLogo";

import useNanoMachine from "../hooks/useNanoMachine";
import AdditionalInformation from "./AddtionalInformation";
import BorderLinearProgress from "./BorderLinearProgress";
import MintButton from "./MintButton";
import MintOnMobile from "./MintOnMobile";

const styles = {
  logo: {
    width: "100%",
    height: "100%",
    color: "grey.500",
  },
};

export default function NanoMachineInfo() {
  const params = useParams();
  const { nanoMachine } = useNanoMachine(params.nanoMachineId);

  const mintedPercentage = !nanoMachine
    ? undefined
    : (+nanoMachine.itemsRedeemed / +nanoMachine.itemsAvailable) * 100;

  return (
    <>
      <AspectRatioBox aspectHeight={1} aspectWidth={1}>
        <Avatar
          variant="rounded"
          src={nanoMachine?.collectionImageUri}
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
            mb: 3,
          },
        }}
      >
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "2rem", maxWidth: "6rem" }} />
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
            }}
          >
            <Typography variant="h5" fontWeight={700} component="p">
              {nanoMachine.displayPrice}
            </Typography>
            <SolanaLogo width={20} />
          </Box>
        )}
        {!nanoMachine ? (
          <Skeleton variant="text" sx={{ height: "2.5rem" }} />
        ) : (
          <Typography variant="h4" fontWeight="500">
            {nanoMachine.collectionName}
          </Typography>
        )}
        {!nanoMachine ? (
          <Box height="2.375rem" />
        ) : (
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
                gap: 2,
                alignItems: "center",
              }}
            >
              <Typography>Total minted</Typography>
              <Typography>
                {nanoMachine.itemsRedeemed}/{nanoMachine.itemsAvailable}
              </Typography>
            </Box>
            <BorderLinearProgress
              variant="determinate"
              value={mintedPercentage}
            />
          </div>
        )}
        <MintButton sx={{ mt: 8 }} />
        <MintOnMobile />
        <AdditionalInformation />
      </Box>
    </>
  );
}
