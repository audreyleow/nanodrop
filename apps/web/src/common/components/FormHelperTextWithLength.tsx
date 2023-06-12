import { Box, FormHelperText } from "@mui/material";

interface FormHelperTextWithLengthProps {
  length: number;
  maxLength: number;
  errorText?: string;
}

export default function FormHelperTextWithLength({
  length,
  maxLength,
  errorText,
}: FormHelperTextWithLengthProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {!!errorText ? (
        <FormHelperText error>{errorText}</FormHelperText>
      ) : (
        <Box />
      )}
      <FormHelperText>
        {length}/{maxLength}
      </FormHelperText>
    </Box>
  );
}
