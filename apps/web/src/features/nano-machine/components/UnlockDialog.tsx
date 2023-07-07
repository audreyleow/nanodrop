import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

import AspectRatioBox from "@/common/components/AspectRatioBox";

import useAuthQr from "../hooks/useAuthQr";
import useNanoMachine from "../hooks/useNanoMachine";
import WorksOnText from "./WorksOnText";

interface UnlockDialogProps {
  open: boolean;
  onClose: () => void;
  setJwtSecret: (jwtSecret: string) => void;
}

export default function UnlockDialog({
  onClose,
  open,
  setJwtSecret,
}: UnlockDialogProps) {
  const { nanoMachine } = useNanoMachine();

  const truncatedCreator = useMemo(
    () =>
      !nanoMachine?.creator
        ? undefined
        : `${nanoMachine.creator.slice(0, 4)}..${nanoMachine.creator.slice(
            -4
          )}`,
    [nanoMachine?.creator]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: 400,
        },
      }}
      keepMounted={false}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography sx={{ mb: 2, textAlign: "center" }}>
          Scan QR Code with wallet{" "}
          <Box
            component="span"
            sx={{
              fontWeight: "bold",
            }}
          >
            {truncatedCreator}
          </Box>{" "}
          to authorize action
        </Typography>
        <UnlockDialogContent setJwtSecret={setJwtSecret} onClose={onClose} />
        <WorksOnText />
      </DialogContent>
    </Dialog>
  );
}

const UnlockDialogContent = ({
  setJwtSecret,
  onClose,
}: {
  setJwtSecret: (jwtSecret: string) => void;
  onClose: () => void;
}) => {
  const authQrRef = useAuthQr({ setJwtSecret, onClose });

  const QrCode = useMemo(
    () => (
      <Box
        ref={authQrRef}
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
    ),
    [authQrRef]
  );

  return (
    <AspectRatioBox
      sx={{
        borderRadius: 1,
        overflow: "hidden",
        mt: 2,
        position: "relative",
      }}
      aspectHeight={1}
      aspectWidth={1}
    >
      {QrCode}
    </AspectRatioBox>
  );
};
