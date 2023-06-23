import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { Box, SxProps, Typography } from "@mui/material";
import { DropzoneState } from "react-dropzone";

export default function AppDropzone({
  dropzoneState,
  children,
  sx,
}: {
  dropzoneState: DropzoneState;
  children?: React.ReactNode;
  sx?: SxProps;
}) {
  const { getRootProps, getInputProps } = dropzoneState;
  return (
    <section>
      <Box
        sx={{
          border: "1px dashed",
          p: 8,
          borderRadius: 2,
          cursor: "pointer",
          ...sx,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Typography
          component="div"
          sx={{
            fontWeight: 500,
            display: "flex",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <InsertPhotoIcon />
          {children}
        </Typography>
      </Box>
    </section>
  );
}
