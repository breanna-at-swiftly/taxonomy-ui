import { Box } from "@mui/material";
import Split from "react-split";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

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
      sizes={[35, 65]} // Initial split closer to 400px for left panel
      minSize={[200, 400]} // Allow left panel to shrink to 200px
      expandToMin={false}
      gutterSize={8}
      gutterAlign="center"
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Navigation Panel */}
      <Box
        id="split-nav-panel"
        sx={{
          height: "100%",
          overflow: "auto",
          borderRight: 1,
          borderColor: "divider",
          position: "relative",
          flex: "0 0 auto",
          width: "100%",
        }}
      >
        {navigation}
      </Box>

      {/* Details Panel */}
      <Box
        id="details-panel"
        sx={{
          height: "100%",
          overflow: "auto",
          position: "relative",
          flex: "1 1 auto",
        }}
      >
        {details}
      </Box>
    </Split>
  );
};
