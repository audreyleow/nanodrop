import { createTheme, responsiveFontSizes } from "@mui/material";
import { grey } from "@mui/material/colors";

let theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ef5350",
      dark: "#e53935",
      contrastText: grey[100],
    },
  },
  typography: {
    fontFamily: "'Work Sans', sans-serif",
  },
  spacing: 4,
});

theme = responsiveFontSizes(theme);

export default theme;
