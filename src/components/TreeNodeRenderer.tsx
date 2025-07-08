import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import type { NodeRendererProps } from "react-arborist";
import type { TreeNode } from "../types/arborist";
import { extractNodeImage } from "../utils/nodeUtils";

export const TreeNodeRenderer: React.FC<NodeRendererProps<TreeNode>> = ({
  node,
  style,
  dragHandle,
  tree,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const nodeData = node.data.data;
  const imageUrl = extractNodeImage(nodeData.metadata);
  const showPlaceholder = !imageUrl || imageError;
  const isSelected = tree.isSelected(node);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <Box
      ref={dragHandle}
      onClick={() => {
        tree.select(node);
        // Let the tree's onSelect handle the node data
      }}
      style={{
        ...style,
        paddingLeft: `${parseInt(style.paddingLeft as string) - 16}px`, // Reduce default indentation
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        height: "100%",
        cursor: "pointer",
        backgroundColor: isSelected ? "rgba(0, 0, 0, 0.08)" : "transparent",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {/* Expand/Collapse Control */}
      {hasChildren && (
        <Box
          onClick={(e) => {
            e.stopPropagation();
            node.toggle();
          }}
          sx={{
            width: 20,
            display: "flex",
            alignItems: "center",
          }}
        >
          {node.isOpen ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </Box>
      )}

      {/* Icon Section */}
      <Box sx={{ width: 20, height: 20, position: "relative" }}>
        {showPlaceholder ? (
          <FolderIcon sx={{ fontSize: 20 }} />
        ) : (
          <>
            {!imageLoaded && <FolderIcon sx={{ fontSize: 20 }} />}
            <Box
              component="img"
              src={imageUrl}
              alt=""
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: imageLoaded ? 1 : 0,
                transition: "opacity 0.2s",
              }}
            />
          </>
        )}
      </Box>

      <Typography
        sx={{
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {nodeData.name}
      </Typography>
    </Box>
  );
};
