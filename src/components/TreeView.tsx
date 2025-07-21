import React, { useEffect, useRef, useState, startTransition } from "react";
import { Tree } from "react-arborist";
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Typography,
} from "@mui/material";
import ExpandAllIcon from "@mui/icons-material/UnfoldMore";
import CollapseAllIcon from "@mui/icons-material/UnfoldLess";
import HomeIcon from "@mui/icons-material/Home"; // Add this import
import SearchIcon from "@mui/icons-material/Search";
import { propertyBoxStyles } from "../styles/propertyStyles";
import type { GraphExportResponse, Node } from "../types/taxonomy";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import NodeDetails from "./NodeDetails";
import type { TreeNode } from "./NodeDetails";
import { SplitLayout } from "./shared/SplitLayout/SplitLayout";
import { TreeNodeRenderer } from "./TreeNodeRenderer";

interface TreeViewProps {
  graphData: GraphExportResponse;
  onNodeSelect: (node: Node) => void;
  selectedNode: Node | null;
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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Keep simple search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      id="tree-view-container"
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      {/* Update toolbar layout */}
      <Box
        id="tree-view-toolbar"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
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

        <TextField
          fullWidth
          size="small"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: "400px" }}
        />
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
            indent={16}
            rowHeight={32}
            onSelect={(selectedNodes) => {
              if (selectedNodes?.[0]) {
                onNodeSelect(selectedNodes[0]);
              }
            }}
            selection="single"
            searchTerm={searchQuery} // Use built-in search
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
