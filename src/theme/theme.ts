import { createTheme } from "@mui/material/styles";

// Export color constants
export const BANNER_COLOR = "#8B4B62"; // light maroon

export const theme = createTheme({
  palette: {
    primary: {
      main: BANNER_COLOR, // Use the constant here too
    },
    secondary: {
      main: "#dc004e",
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
