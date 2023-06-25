import { Box, Typography } from "@mui/material";
import Countdown from "react-countdown";

interface MintCountdownRender {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const renderCountdown = ({
  days,
  hours,
  minutes,
  seconds,
}: MintCountdownRender) => {
  hours += days * 24;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        textTransform: "none",
        "& > *": {
          fontWeight: 700,
        },
      }}
    >
      <Typography>
        <span>{hours < 10 ? `0${hours}` : hours}</span>
        <span>hrs</span>
      </Typography>
      <Typography>
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>
        <span>mins</span>
      </Typography>
      <Typography>
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
        <span>secs</span>
      </Typography>
    </Box>
  );
};

export default function MintCountDown({ startDate }: { startDate?: Date }) {
  if (!startDate) {
    return null;
  }

  return <Countdown date={startDate} renderer={renderCountdown} />;
}
