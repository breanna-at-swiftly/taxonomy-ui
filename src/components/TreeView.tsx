import { Tree } from "react-arborist";
import { useMemo, useRef, useState } from "react";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArticleIcon from "@mui/icons-material/Article";
import ExpandAllIcon from "@mui/icons-material/UnfoldMore";
import CollapseAllIcon from "@mui/icons-material/UnfoldLess";
import HomeIcon from "@mui/icons-material/Home"; // Add this import
import { propertyBoxStyles } from "../styles/propertyStyles";
import type { GraphExportData } from "../hooks/useGraphExport";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import NodeDetails from "./NodeDetails";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data: {
    node_type_id: number;
    source_id: string;
    notes: string;
    metadata: string;
  };
}

interface TreeViewProps {
  graphData: GraphExportData;
}

export const TreeView: React.FC<TreeViewProps> = ({ graphData }) => {
  const treeRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  const treeData = useMemo(() => {
    const nodeMap = new Map(
      graphData.nodes.map((node) => [
        node.node_id,
        {
          id: node.node_id,
          name: node.name,
          children: [],
          // Don't nest the data again since it's already a complete node
          ...node, // Spread the node properties directly
        },
      ])
    );

    // Build parent-child relationships from links
    graphData.links.forEach((link) => {
      const parent = nodeMap.get(link.from_node_id);
      const child = nodeMap.get(link.to_node_id);
      if (parent && child) {
        if (!parent.children) parent.children = [];
        parent.children.push(child);
      }
    });

    const rootNode = nodeMap.get(graphData.graph.root_node_id);
    return rootNode ? [rootNode] : [];
  }, [graphData]);

  const handleExpandAll = () => {
    treeRef.current?.openAll();
  };

  const handleCollapseAll = () => {
    treeRef.current?.closeAll();
  };

  // Add isRoot check function at component level
  const isRootNode = (nodeId: string) =>
    nodeId === graphData.graph.root_node_id;

  const renderNode = ({ node, style, dragHandle }) => {
    const hasChildren = node.data.children?.length > 0;
    const isRoot = isRootNode(node.id);
    const isSelected = selectedNode?.id === node.id;

    return (
      <Box
        ref={dragHandle}
        onClick={() => setSelectedNode(node)}
        sx={{
          ...style,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          py: 0.5,
          backgroundColor: isSelected ? "rgba(0, 0, 0, 0.08)" : "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        {/* Expand/Collapse Arrow */}
        <Box
          sx={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            visibility: hasChildren ? "visible" : "hidden",
          }}
          onClick={() => node.toggle()}
        >
          {node.isOpen ? (
            <ExpandMoreIcon fontSize="small" />
          ) : (
            <ChevronRightIcon fontSize="small" />
          )}
        </Box>

        {/* Node Type Icon */}
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
          {isRoot ? (
            <HomeIcon fontSize="small" />
          ) : hasChildren ? (
            node.isOpen ? (
              <FolderOpenIcon fontSize="small" />
            ) : (
              <FolderIcon fontSize="small" />
            )
          ) : (
            <ArticleIcon fontSize="small" />
          )}
        </Box>

        {/* Node Name */}
        <Box
          sx={{
            ml: 1,
            fontWeight: isRoot ? 600 : node.isLeaf ? "normal" : "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {isRoot ? "ROOT" : node.data.name}
        </Box>
      </Box>
    );
  };

  if (!treeData.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Tooltip title="Expand All">
          <IconButton size="small" onClick={handleExpandAll}>
            <ExpandAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Collapse All">
          <IconButton size="small" onClick={handleCollapseAll}>
            <CollapseAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0, // Important for proper scrolling
          overflow: "hidden",
        }}
      >
        {/* Tree Panel */}
        <Box
          sx={{
            width: 400,
            flexShrink: 0,
            borderRight: 1,
            borderColor: "divider",
            overflow: "auto",
          }}
        >
          <Tree
            ref={treeRef}
            initialData={treeData}
            width={400}
            height={560}
            indent={4}
            rowHeight={32}
            overscanCount={4}
          >
            {renderNode}
          </Tree>
        </Box>

        {/* Details Panel */}
        <Box
          sx={{
            flex: 1,
            ml: 0, // Remove margin
            backgroundColor: "background.paper",
            overflow: "auto",
          }}
        >
          <NodeDetails selectedNode={selectedNode} isRootNode={isRootNode} />
        </Box>
      </Box>
    </Box>
  );
};

export default TreeView;
