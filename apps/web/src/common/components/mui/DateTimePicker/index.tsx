import InfoIcon from "@mui/icons-material/Info";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Tooltip from "@mui/material/Tooltip";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDateTimePicker } from "@mui/x-date-pickers/DesktopDateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import * as React from "react";

interface DateTimePickerProps {
  dateTimeValue: Dayjs;
  setDateTimeValue: (newValue: Dayjs) => void;
}

export default function DateTimePicker({
  dateTimeValue,
  setDateTimeValue,
}: DateTimePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <InputLabel
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          Launch Date
          <Tooltip
            placement="top"
            title="The date your collection will be live for your fans to mint! Set to current date and time to launch now or set in future to allow minting only after the selected date."
          >
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </InputLabel>
        <DesktopDateTimePicker
          sx={{
            width: "100%",
          }}
          slotProps={{
            textField: {
              color: "secondary",
            },
          }}
          defaultValue={dayjs("2023-05-25T15:30")}
          value={dateTimeValue}
          onChange={(newValue) => {
            setDateTimeValue(newValue);
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
