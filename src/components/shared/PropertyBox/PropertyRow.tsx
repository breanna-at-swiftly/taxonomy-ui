import { Box, Typography, CardMedia } from "@mui/material";
import { useState } from "react";
import { isCategoryNode, extractCategoryImage } from "../../../types/nodeTypes";
import type { PropertyItem } from "./types";

const PropertyRow: React.FC<PropertyItem> = ({
  label,
  value,
  type = "text",
  index = 0,
  nodeType, // Add this to PropertyItem type
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderValue = () => {
    // Handle metadata with potential image
    if (label === "Metadata" && type === "json" && isCategoryNode(nodeType)) {
      const imageUrl = extractCategoryImage(value as string);
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {imageUrl && (
            <CardMedia
              component="img"
              src={imageUrl}
              alt="Category image"
              sx={{
                width: 100,
                height: 100,
                objectFit: "contain",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.3s",
                backgroundColor: "background.paper",
              }}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          <Typography
            component="pre"
            sx={{
              fontSize: "0.875rem",
              m: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {value || "—"}
          </Typography>
        </Box>
      );
    }

    return value || "—";
  };

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
        {renderValue()}
      </Typography>
    </Box>
  );
};

export default PropertyRow;
