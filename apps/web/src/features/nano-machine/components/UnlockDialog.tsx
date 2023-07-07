import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";

import AspectRatioBox from "@/common/components/AspectRatioBox";

interface UnlockDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function UnlockDialog({ onClose, open }: UnlockDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiPaper-root": {
          width: "100%",
          maxWidth: 500,
        },
      }}
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
        <AspectRatioBox aspectHeight={1} aspectWidth={1}>
          Hello
        </AspectRatioBox>
      </DialogContent>
    </Dialog>
  );
}
