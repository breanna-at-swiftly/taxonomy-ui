import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGraphs } from "../context/GraphContext";
import { useGraphExport } from "../hooks/useGraphExport";
import type { TaxonomyGraph } from "../types/taxonomy";
import { BANNER_COLOR } from "../theme/theme";
import TreeView from "./TreeView";
import { ErrorBoundary } from "./shared/ErrorBoundary/ErrorBoundary";
import { SplitLayout } from "./shared/SplitLayout/SplitLayout"; // Import directly from component file
import { NodeDetails } from "./NodeDetails";

export const GraphEditor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { graphs, isLoading: graphsLoading } = useGraphs();
  const { fetchGraphData, isLoading: exportLoading } = useGraphExport();
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    () => {
      const graphId = searchParams.get("graphId");
      return null; // Let the effect handle initial selection
    }
  );
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [graphData, setGraphData] = useState<GraphExportData | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  // URL-based graph selection
  useEffect(() => {
    const graphId = searchParams.get("graphId");
    if (graphId && graphs?.length) {
      const graph = graphs.find((g) => g.graph_id === parseInt(graphId));
      if (
        graph &&
        (!selectedGraph || selectedGraph.graph_id !== graph.graph_id)
      ) {
        console.log("Restoring graph selection from URL:", graph.name);
        setSelectedGraph(graph);
      }
    }
  }, [searchParams, graphs]); // Keep clean dependency array

  // Handle graph selection
  const handleGraphSelect = useCallback(
    async (newGraph: TaxonomyGraph | null) => {
      console.log("Selected new graph:", newGraph?.name);

      // Clear tree view and selection immediately
      setGraphData(null);
      setSelectedNode(null); // Add this line
      setIsLoadingGraph(true);
      setSelectedGraph(newGraph);

      if (newGraph) {
        setSearchParams({ graphId: newGraph.graph_id.toString() });
      } else {
        // No graph selected, clear everything
        setIsLoadingGraph(false);
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

  // Load graph data
  useEffect(() => {
    if (!selectedGraph) {
      setGraphData(null);
      return;
    }

    setIsLoadingGraph(true);
    fetchGraphData(selectedGraph.graph_id)
      .then((data) => {
        console.log("Fetched new graph data:", data);
        setGraphData(data);
      })
      .catch((err) => console.error("Failed to load graph data:", err))
      .finally(() => setIsLoadingGraph(false));
  }, [selectedGraph?.graph_id, fetchGraphData]);

  return (
    <Box
      id="graph-editor-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {/* Fixed Toolbar */}
      <Box
        id="graph-editor-toolbar"
        sx={{
          height: 48,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: BANNER_COLOR,
          display: "flex",
          alignItems: "center",
          pl: 1.25, // 10px left padding
        }}
      >
        <Autocomplete
          value={selectedGraph}
          onChange={(_, newValue) => handleGraphSelect(newValue)}
          options={graphs || []}
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) =>
            option.graph_id === value.graph_id
          }
          renderOption={(props, option) => (
            <li {...props} key={option.graph_id}>
              {option.name}
            </li>
          )}
          sx={{
            width: 300,
            "& .MuiInputBase-root": {
              bgcolor: "background.paper",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select Graph"
              size="small"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {graphsLoading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Box>

      {/* Graph View */}
      <Box
        id="graph-view"
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          minWidth: 0,
        }}
      >
        <ErrorBoundary>
          <SplitLayout
            navigation={
              <Box
                id="tree-panel-container"
                sx={{
                  width: 400,
                  flexShrink: 0,
                  borderRight: 1,
                  borderColor: "divider",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 400,
                }}
              >
                {isLoadingGraph ? (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : null}
                {graphData ? (
                  <TreeView
                    graphData={graphData}
                    selectedNode={selectedNode}
                    onNodeSelect={setSelectedNode}
                  />
                ) : (
                  // Empty placeholder to maintain container size
                  <Box
                    id="tree-view-placeholder"
                    sx={{ width: "100%", height: "100%" }}
                  />
                )}
              </Box>
            }
            details={
              <Box
                id="details-panel"
                sx={{
                  flex: 1,
                  minWidth: 0, // Prevent overflow
                }}
              >
                {selectedNode ? (
                  <NodeDetails
                    node={selectedNode}
                    isRootNode={(nodeId) =>
                      nodeId === graphData?.rootNode?.node_id
                    }
                  />
                ) : (
                  <Typography color="text.secondary">
                    Select a node to view details
                  </Typography>
                )}
              </Box>
            }
          />
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default GraphEditor;
