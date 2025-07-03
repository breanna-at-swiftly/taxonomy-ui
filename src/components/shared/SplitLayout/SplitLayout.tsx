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
  const navigationRef = useRef<HTMLDivElement>(null);

  return (
    <Split
      id="split-layout-container"
      data-testid="split-layout"
      sizes={[40, 60]}
      minSize={[480, 600]}
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
