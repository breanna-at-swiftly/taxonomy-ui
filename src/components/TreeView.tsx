import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import { Tree } from "react-arborist";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandAllIcon from "@mui/icons-material/UnfoldMore";
import CollapseAllIcon from "@mui/icons-material/UnfoldLess";
import type { GraphExportData } from "../hooks/useGraphExport";
import { TreeNodeRenderer } from "./TreeNodeRenderer";
import type { TreeNode } from "../types/arborist";
import { createTreeNode } from "../types/arborist";

interface TreeViewProps {
  graphData: GraphExportData;
  onNodeSelect?: (node: TreeNode) => void; // Optional callback for node selection
  selectedNode?: TreeNode | null; // Currently selected node
}

export const TreeView: React.FC<TreeViewProps> = ({
  graphData,
  onNodeSelect,
  selectedNode,
}) => {
  const treeRef = useRef(null);
  const renderCount = useRef(0); // Move useRef to component level
  const [isLoading, setIsLoading] = useState(true);
  const [treeKey, setTreeKey] = useState(0);

  // Transform graph nodes to TreeNodes
  const treeData = useMemo(() => {
    if (!graphData?.nodes) return [];

    return graphData.nodes.map((node) => createTreeNode(node));
  }, [graphData]);

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
          setTreeKey((prev) => prev + 1);
        });
      }
    } catch (error) {
      console.error("Error building tree:", error);
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
            width="100%"
            height={560}
            indent={2}
            rowHeight={32}
            onSelect={(node) => {
              console.log("3. TreeView - onSelect:", {
                nodeId: node?.data?.id,
                nodeName: node?.data?.name,
              });
              onNodeSelect?.(node);
            }}
          >
            {TreeNodeRenderer}
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
