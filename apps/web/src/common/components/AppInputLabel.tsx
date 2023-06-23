import HelpIcon from "@mui/icons-material/Help";
import { Box, IconButton, Tooltip } from "@mui/material";
import InputLabel, { InputLabelProps } from "@mui/material/InputLabel";

interface AppInputLabelProps extends InputLabelProps {
  helpText?: string;
}

export default function AppInputLabel({
  helpText,
  children,
  required,
  ...rest
}: AppInputLabelProps) {
  return (
    <InputLabel {...rest}>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {children}
          {required && "*"}
        </Box>
        {!!helpText && (
          <Tooltip title={helpText}>
            <IconButton>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </InputLabel>
  );
}
