import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import HomeIcon from "@mui/icons-material/Home";
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

  // Update root node check
  const isRoot = node.id === tree.root?.children[0]?.id;
  const nodeData = node.data.data;
  const imageUrl = extractNodeImage(nodeData.metadata);
  const showPlaceholder = !imageUrl || imageError;
  const isSelected = tree.isSelected(node.id);
  const hasChildren = node.children && node.children.length > 0;

  // Add debug logging
  console.log("TreeNodeRenderer node:", {
    nodeId: node.id,
    treeRoot: tree.root,
    isRoot: node.id === tree.root?.id,
    nodeData: nodeData,
    hasChildren,
  });

  return (
    <Box
      ref={dragHandle}
      onClick={(e) => {
        e.stopPropagation();
        tree.select(node);
      }}
      style={style} // Use original style without modification
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
      <Box
        sx={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          visibility: hasChildren ? "visible" : "hidden",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (hasChildren) {
            node.toggle();
          }
        }}
      >
        {node.isOpen ? (
          <ExpandMoreIcon fontSize="small" />
        ) : (
          <ChevronRightIcon fontSize="small" />
        )}
      </Box>

      {/* Node Icon */}
      <Box
        sx={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isRoot ? "primary.main" : "action.active",
        }}
      >
        {showPlaceholder ? (
          isRoot ? (
            <HomeIcon fontSize="small" />
          ) : hasChildren ? (
            node.isOpen ? (
              <FolderOpenIcon fontSize="small" />
            ) : (
              <FolderIcon fontSize="small" />
            )
          ) : (
            <ArticleIcon fontSize="small" />
          )
        ) : (
          <Box
            component="img"
            src={imageUrl}
            alt=""
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      {/* Node Name */}
      <Typography
        sx={{
          fontSize: "0.875rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontWeight: isRoot ? 500 : 400,
        }}
      >
        {isRoot ? "ROOT" : nodeData.name}
      </Typography>
    </Box>
  );
};
