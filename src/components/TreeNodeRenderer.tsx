import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import type { NodeRendererProps } from "react-arborist";
import { isCategoryNode, extractCategoryImage } from "../types/nodeTypes";
import type { TreeNode } from "../types/arborist";

// Update component definition to use correct types
export const TreeNodeRenderer: React.FC<NodeRendererProps<TreeNode>> = ({
  node,
  style,
  dragHandle,
  tree,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const nodeData = node.data.data; // Access our Node data through TreeNodeData
  const metadata = nodeData.metadata;
  const nodeType = nodeData.node_type_id;
  const imageUrl = isCategoryNode(nodeType)
    ? extractCategoryImage(metadata)
    : null;

  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && tree?.toggle) {
      tree.toggle(node); // Use tree.toggle instead of node.toggle
    }
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    console.log("TreeNodeRenderer - handleNodeClick:", {
      nodeId: node.id,
      nodeName: node.name,
      hasTreeSelect: !!tree?.select,
    });

    if (tree?.select) {
      tree.select(node);
    }
  };

  return (
    <Box
      ref={dragHandle}
      style={{
        ...style,
        paddingLeft: `${node.level * 20}px`,
      }}
      onClick={handleNodeClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        pl: 1,
        height: "100%",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      {hasChildren ? (
        <Box
          onClick={handleToggle}
          sx={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: node.isOpen ? "rotate(90deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </Box>
      ) : (
        <Box sx={{ width: 24 }} />
      )}

      {imageUrl ? (
        <Box
          sx={{
            width: 24,
            height: 24,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageIcon
            sx={{
              fontSize: 20,
              opacity: imageLoaded ? 0 : 1,
              position: "absolute",
            }}
          />
          <Box
            component="img"
            src={imageUrl}
            alt=""
            onLoad={() => setImageLoaded(true)}
            sx={{
              width: 20,
              height: 20,
              objectFit: "contain",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.2s",
            }}
          />
        </Box>
      ) : (
        <FolderIcon sx={{ fontSize: 20 }} />
      )}

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
