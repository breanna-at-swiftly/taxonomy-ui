import { Box, Typography } from "@mui/material";
import type { PropertyItem } from "./types";

const PropertyRow: React.FC<PropertyItem> = ({
  label,
  value,
  type = "text",
  index = 0,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        p: 1,
        backgroundColor:
          index % 2 === 0 ? "transparent" : "rgba(128, 0, 32, 0.03)",
        borderRadius: 1,
        width: "100%",
        minHeight: 32,
      }}
    >
      <Typography
        sx={{
          width: 120,
          flexShrink: 0,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "text.secondary",
          textAlign: "left", // Ensure left alignment
          pt: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        component={type === "json" ? "pre" : "p"}
        sx={{
          flex: 1,
          fontSize: "0.875rem",
          pl: 2,
          m: 0,
          textAlign: "left", // Ensure left alignment
          whiteSpace: "normal", // Allow text to wrap naturally
          wordBreak: "break-word", // Handle long strings
          fontFamily: type === "json" ? "monospace" : "inherit",
        }}
      >
        {value || "—"}
      </Typography>
    </Box>
  );
};

export default PropertyRow;
