import { Box, Menu, MenuItem, Typography } from "@mui/material";
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

  // Add state for context menu
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // Handle right click
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX,
            mouseY: event.clientY,
          }
        : null
    );
  };

  // Handle menu close
  const handleClose = () => {
    setContextMenu(null);
  };

  return (
    <Box
      ref={dragHandle}
      onClick={(e) => {
        e.stopPropagation();
        tree.select(node);
      }}
      onContextMenu={handleContextMenu}
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

      {/* Add context menu */}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            console.log("Add child to:", node.id);
            handleClose();
          }}
        >
          Add Child
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Edit node:", node.id);
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Delete node:", node.id);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};
