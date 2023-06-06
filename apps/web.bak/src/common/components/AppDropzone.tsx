import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { DropzoneState } from "react-dropzone";

interface AppDropzoneProps {
  dropzone: DropzoneState;
  errorMessages: string[];
  helperText?: string;
}

export default function AppDropzone({
  dropzone,
  errorMessages,
  helperText,
}: AppDropzoneProps) {
  const { acceptedFiles, getRootProps, getInputProps } = dropzone;

  const sortedFileNames = useMemo(() => {
    const fileNames = acceptedFiles.map((file) => file.name);
    fileNames.sort();
    return fileNames;
  }, [acceptedFiles]);

  return (
    <section>
      <Box
        {...getRootProps()}
        sx={{
          border: "1px dashed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: 100,
          borderRadius: 1,
          p: 4,
          textAlign: "center",
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          Drag and drop some files here, or click to select files.
        </Typography>
        {helperText && <Typography variant="caption">{helperText}</Typography>}
      </Box>
      <aside>
        {errorMessages.length > 0 ? (
          <Box
            sx={{
              overflow: "auto",
            }}
            component="ul"
          >
            {errorMessages.map((message, i) => (
              <Typography color="error" key={message + i} component="li">
                {message}
              </Typography>
            ))}
          </Box>
        ) : acceptedFiles.length > 0 ? (
          <>
            <Typography>Files to upload:</Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflow: "auto",
              }}
              component="ul"
            >
              {sortedFileNames.map((name, i) => (
                <Typography component="li" key={name + i}>
                  {name}
                </Typography>
              ))}
            </Box>
          </>
        ) : null}
      </aside>
    </section>
  );
}
