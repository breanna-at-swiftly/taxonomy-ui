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
import { SplitLayout } from "./shared/SplitLayout/SplitLayout";

interface TreeViewProps {
  graphData: GraphExportData;
}

export const TreeView: React.FC<TreeViewProps> = ({
  graphData,
  onNodeSelect,
  selectedNode,
}) => {
  const treeRef = useRef(null);
  const renderCount = useRef(0); // Move useRef to component level
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
      // Only clear selectedNode if the root node actually changes
      // setSelectedNode(null);

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
  }, [graphData?.rootNode?.node_id]);

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
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling
          // setSelectedNode(node);
          onNodeSelect(node);
          console.log("Node selected:", node); // Add logging
        }}
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
            // Update font weights to be lighter
            fontWeight: isRoot ? 500 : node.isLeaf ? 400 : 450,
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
      id="tree-view-container"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        id="tree-view-toolbar"
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
          <IconButton
            id="expand-all-button"
            size="small"
            onClick={handleExpandAll}
          >
            <ExpandAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Collapse All">
          <IconButton
            id="collapse-all-button"
            size="small"
            onClick={handleCollapseAll}
          >
            <CollapseAllIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box id="tree-view-content" sx={{ position: "relative", flex: 1 }}>
        {isLoading ? (
          <Box
            id="tree-view-loading"
            sx={
              {
                /* ...existing styles... */
              }
            }
          >
            <CircularProgress />
            <Typography variant="body2">Loading tree data...</Typography>
          </Box>
        ) : treeData.length > 0 ? (
          <Tree
            key={treeKey}
            ref={treeRef}
            initialData={treeData}
            // Remove fixed width, use parent container width
            width="100%"
            height={560}
            indent={2}
            rowHeight={32}
          >
            {renderNode}
          </Tree>
        ) : (
          <Box id="tree-view-empty" sx={{ p: 2 }}>
            <Typography>No tree data available</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TreeView;
