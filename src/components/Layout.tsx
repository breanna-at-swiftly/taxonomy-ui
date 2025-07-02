import { Box, Tabs, Tab, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { VERSION } from "../config/version";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const TOOLBAR_HEIGHT = 48;
  const TABS_HEIGHT = 40;
  const BORDER_HEIGHT = 1;
  const TOTAL_HEADER_HEIGHT = TOOLBAR_HEIGHT + TABS_HEIGHT + BORDER_HEIGHT;

  // Color constants
  const BANNER_COLOR = "#8B4B62"; // light maroon
  const CONTROLS_BG = "#f5f5f5"; // medium gray

  return (
    <Box
      id="root-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        pl: "10px",
        width: "100vw",
        maxWidth: "100vw",
        position: "absolute",
        left: 0,
        overflow: "hidden",
      }}
    >
      <AppBar
        id="header"
        position="fixed"
        sx={{
          backgroundColor: BANNER_COLOR,
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "48px !important" }}>
          {/* Logo placeholder - adjust width as needed */}
          <Box sx={{ width: 40, height: 40, mr: 2, bgcolor: "#ddd" }} />

          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "white",
            }}
          >
            Swiftly Taxonomy Manager v{VERSION.number} {VERSION.label}
          </Typography>
        </Toolbar>

        {/* Navigation Tabs */}
        <Box sx={{ bgcolor: "white" }}>
          <Tabs
            value={location.pathname}
            sx={{
              minHeight: TABS_HEIGHT,
              "& .MuiTab-root": {
                color: "rgba(0, 0, 0, 0.87)",
                transition: "color 0.2s ease-in-out",
                "&.Mui-selected": {
                  color: BANNER_COLOR,
                },
                "&:hover": {
                  color: BANNER_COLOR,
                  opacity: 0.7,
                  backgroundColor: "rgba(139, 75, 98, 0.04)", // Light tint of BANNER_COLOR
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: BANNER_COLOR,
              },
            }}
          >
            <Tab
              label="Graph List"
              value="/"
              onClick={() => navigate("/")}
              sx={{ minHeight: TABS_HEIGHT }}
            />
            <Tab
              label="Graph Editor"
              value="/editor"
              onClick={() => navigate("/editor")}
              sx={{ minHeight: TABS_HEIGHT }}
            />
          </Tabs>
        </Box>
      </AppBar>

      {/* Spacer for fixed header */}
      <Box sx={{ height: TOTAL_HEADER_HEIGHT }} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          m: 0,
          p: 0,
          width: "100%",
          overflow: "auto",
        }}
      >
        <Outlet context={{ isToolbar: false }} />
      </Box>
    </Box>
  );
}
