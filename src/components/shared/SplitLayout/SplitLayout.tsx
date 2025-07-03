import { Box } from "@mui/material";
import Split from "react-split";
import type { ReactNode } from "react";

interface SplitLayoutProps {
  navigation: ReactNode;
  details: ReactNode;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  navigation,
  details,
}) => {
  return (
    <Split
      id="split-layout-container"
      data-testid="split-layout"
      sizes={[40, 60]}
      minSize={[480, 600]}
      expandToMin={true} // Changed to true to enforce minimum sizes
      gutterSize={8}
      gutterAlign="center"
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        position: "relative",
        width: "100%", // Ensure full width
      }}
    >
      {/* Navigation Panel */}
      <Box
        id="split-nav-panel"
        sx={{
          height: "100%",
          width: "100%", // Ensure full width within split panel
          overflow: "auto",
          borderRight: 1,
          borderColor: "divider",
          position: "relative",
          display: "flex", // Add flex display
          flexDirection: "column", // Stack children vertically
        }}
      >
        {navigation}
      </Box>

      {/* Details Panel */}
      <Box
        id="details-panel"
        sx={{
          height: "100%",
          width: "100%", // Ensure full width within split panel
          overflow: "auto",
          position: "relative",
          flex: 1,
        }}
      >
        {details}
      </Box>
    </Split>
  );
};
