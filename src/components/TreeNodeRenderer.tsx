import { Box, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { isCategoryNode, extractCategoryImage } from "../types/nodeTypes";

// Define our own props interface based on react-arborist's usage
interface TreeNodeRendererProps {
  node: {
    data: {
      data: {
        name: string;
        node_type_id: number;
        metadata?: string;
      };
      children: any[]; // Add children to type definition
    };
    isOpen?: boolean;
    toggle?: () => void;
    isLeaf: boolean;
    level: number;
  };
  style: React.CSSProperties;
  dragHandle?: React.Ref<any>;
  tree?: any; // Add tree reference
}

export const TreeNodeRenderer: React.FC<TreeNodeRendererProps> = ({
  node,
  style,
  dragHandle,
  tree,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const nodeData = node.data?.data || {};
  const metadata = nodeData.metadata;
  const nodeType = nodeData.node_type_id;
  const imageUrl = isCategoryNode(nodeType)
    ? extractCategoryImage(metadata)
    : null;

  // Check actual children array
  const hasChildren = node.data.children && node.data.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && node.toggle) {
      node.toggle();
    }
  };

  return (
    <Box
      ref={dragHandle}
      style={{
        ...style,
        paddingLeft: `${node.level * 20}px`, // Manual indentation
      }}
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
      {/* Only show expand/collapse for nodes with actual children */}
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

      {/* Node Icon/Image */}
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

      {/* Node Label */}
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
