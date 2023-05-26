import InfoIcon from "@mui/icons-material/Info";
import { Box, SxProps, Theme } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import { ChangeEventHandler, ReactNode } from "react";

import styles from "./styles.module.css";

interface InputFieldProps {
  labelText: string;
  placeholderText: string;
  tooltipText: string;
  inputValue: string;
  inputOnChange: ChangeEventHandler<HTMLInputElement>;
  endLogo?: JSX.Element;
  error?: boolean;
  helperText?: ReactNode;
  name?: string;
  sx?: SxProps<Theme>;
  multiline?: boolean;
  rows?: number;
}

export default function InputField({
  labelText,
  placeholderText,
  tooltipText,
  inputValue,
  inputOnChange,
  endLogo,
  error,
  helperText,
  name,
  sx,
  multiline,
  rows,
}: InputFieldProps) {
  return (
    <Box className={styles.inputField} sx={sx}>
      <InputLabel sx={{ display: "flex", alignItems: "center" }}>
        {labelText}
        <Tooltip title={tooltipText} placement="top">
          <IconButton size="small">
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </InputLabel>
      <TextField
        color="secondary"
        type="text"
        required
        id={`${labelText}-input-field`}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{endLogo}</InputAdornment>
          ),
        }}
        name={name}
        error={error}
        helperText={helperText}
        placeholder={placeholderText}
        value={inputValue}
        onChange={inputOnChange}
        multiline={multiline}
        rows={rows}
      />
    </Box>
  );
}
