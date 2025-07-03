import React, { useEffect, useRef, useState, startTransition } from "react";
import { Tree } from "react-arborist";
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
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
import type { TreeNode } from "./NodeDetails";

interface TreeViewProps {
  graphData: GraphExportData;
}

export const TreeView: React.FC<TreeViewProps> = ({ graphData }) => {
  const treeRef = useRef(null);
  const renderCount = useRef(0); // Move useRef to component level
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [treeKey, setTreeKey] = useState(0);

  useEffect(() => {
    // Increment render count here
    renderCount.current++;

    console.log(`Tree build attempt ${renderCount.current}:`, {
      hasData: !!graphData,
      rootNodeId: graphData?.rootNode?.node_id,
      graphId: graphData?.graph?.graph_id,
      timestamp: new Date().toISOString(),
    });

    if (!graphData?.nodes || !graphData?.links || !graphData?.rootNode) {
      console.warn("Missing required graph data");
      setTreeData([]);
      setIsLoading(false);
      return;
    }

    try {
      // Clear selected node when graph changes
      setSelectedNode(null);

      // Build tree structure (existing nodeMap creation code)
      const nodeMap = new Map(
        graphData.nodes.map((node) => [
          node.node_id,
          {
            id: node.node_id,
            children: [],
            parents: [],
            data: {
              name: node.name, // Move name into data
              node_type_id: node.node_type_id,
              source_id: node.source_id,
              notes: node.notes,
              metadata: node.metadata,
              inserted_datetime: node.inserted_datetime,
              updated_datetime: node.updated_datetime,
              updated_by: node.updated_by,
            },
            // These properties are required by react-arborist Tree
            name: node.name, // Duplicate for Tree display
            isLeaf: false, // Will be set correctly when processing links
            isOpen: false, // Tree component manages this
          },
        ])
      );

      // Process links (existing links processing)
      graphData.links.forEach(({ from_node_id, to_node_id }) => {
        const parent = nodeMap.get(from_node_id);
        const child = nodeMap.get(to_node_id);
        if (parent && child) {
          parent.children = parent.children || [];
          parent.children.push(child);
        }
      });

      // Set tree with root node
      const rootTreeNode = nodeMap.get(graphData.rootNode.node_id);
      if (rootTreeNode) {
        console.log(`Setting tree data (attempt ${renderCount.current}):`, {
          name: rootTreeNode.name,
          id: rootTreeNode.id,
          childCount: rootTreeNode.children?.length || 0,
          timestamp: new Date().toISOString(),
        });

        // Update state updates to use imported startTransition
        startTransition(() => {
          setTreeData([rootTreeNode]);
          setTreeKey((prev) => prev + 1);
        });
      }
    } catch (error) {
      console.error("Error building tree:", error);
      setTreeData([]);
    } finally {
      setIsLoading(false);
    }
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

  // Update renderNode to use data.name for display logic but name for rendering
  const renderNode = ({ node, style, dragHandle }) => {
    const hasChildren = node.children?.length > 0;
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
          {isRoot ? "ROOT" : node.data.name} {/* Use data.name for display */}
        </Box>
      </Box>
    );
  };

  // Change rendering condition
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            position: "relative", // Add for spinner positioning
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                gap: 2,
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent overlay
              }}
            >
              <CircularProgress
                size={40}
                sx={{
                  color: "primary.main",
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Loading tree data...
              </Typography>
            </Box>
          ) : treeData.length > 0 ? (
            <Tree
              key={treeKey}
              ref={treeRef}
              initialData={treeData}
              width={400}
              height={560}
              indent={2} // Compact tree hierarchy
              rowHeight={32}
            >
              {renderNode}
            </Tree>
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography>No tree data available</Typography>
            </Box>
          )}
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
          {selectedNode && (
            <NodeDetails node={selectedNode} isRootNode={isRootNode} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TreeView;
