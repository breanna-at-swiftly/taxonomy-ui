import { createTheme } from "@mui/material/styles";

// Color constants
export const BANNER_COLOR = "#8B4B62"; // light maroon
export const CONTROLS_BG = "#f5f5f5"; // medium gray

// Create theme
export const theme = createTheme({
  palette: {
    primary: {
      main: BANNER_COLOR,
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "#bbdefb",
          },
        },
      },
    },
  },
});
