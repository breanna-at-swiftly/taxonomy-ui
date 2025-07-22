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
import { taxonomyService } from "../services/taxonomyService";
import type { Graph, GraphExportResponse, Node } from "../types/taxonomy";

import { BANNER_COLOR } from "../theme/theme";
import TreeView from "./TreeView";
import { ErrorBoundary } from "./shared/ErrorBoundary/ErrorBoundary";
import { SplitLayout } from "./shared/SplitLayout/SplitLayout"; // Import directly from component file
import { NodeDetails } from "./NodeDetails";

export const GraphEditor: React.FC<{ graphId: number }> = ({ graphId }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { graphs, isLoading: graphsLoading } = useGraphs();
  const [selectedGraph, setSelectedGraph] = useState<Graph | null>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(false);
  const [graphData, setGraphData] = useState<GraphExportResponse | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Add debug logging for graphs data
  useEffect(() => {
    console.log("GraphEditor - Graphs state updated:", {
      graphsLoading,
      graphsCount: graphs?.length,
      graphs,
      timestamp: new Date().toISOString(),
    });
  }, [graphs, graphsLoading]);

  // Handle graph selection
  const handleGraphSelect = useCallback(
    async (newGraph: Graph | null) => {
      console.log("Selected new graph:", newGraph?.name);
      setGraphData(null);
      setSelectedNode(null);
      setSelectedGraph(newGraph);

      if (newGraph) {
        setSearchParams({ graphId: newGraph.graph_id.toString() });
        setIsLoadingGraph(true);
        try {
          const data = await taxonomyService.fetchGraphExport(
            newGraph.graph_id
          );
          setGraphData(data);
          setError(null);
        } catch (err) {
          setError(
            err instanceof Error ? err : new Error("Failed to load graph")
          );
          console.error("Failed to load graph data:", err);
        } finally {
          setIsLoadingGraph(false);
        }
      } else {
        setSearchParams({});
      }
    },
    [setSearchParams]
  );

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
        handleGraphSelect(graph);
      }
    }
  }, [searchParams, graphs, handleGraphSelect]);

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
      {/* Fixed Toolbar - Always render this */}
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
          loading={graphsLoading}
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

      {/* Conditional rendering for graph content */}
      <Box
        id="graph-view"
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          minWidth: 0,
        }}
      >
        {error ? (
          <div>Error: {error.message}</div>
        ) : !graphData && !isLoadingGraph ? (
          <div>Select a graph to view</div>
        ) : (
          <ErrorBoundary>
            <SplitLayout
              navigation={
                <Box
                  id="tree-panel-container"
                  sx={{
                    flex: 1,
                    height: "100%",
                    minHeight: "100vh",
                    width: "100%",
                    borderRight: 1,
                    borderColor: "divider",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "auto",
                    "& .react-arborist": {
                      flex: 1,
                      padding: "8px",
                      width: "100% !important",
                      height: "100% !important",
                    },
                  }}
                >
                  {isLoadingGraph && (
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
                        zIndex: 1,
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                  {graphData ? (
                    <TreeView
                      graphData={graphData}
                      selectedNode={selectedNode}
                      onNodeSelect={setSelectedNode}
                    />
                  ) : (
                    <Box
                      id="tree-view-placeholder"
                      sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: "inherit",
                        flex: 1,
                        padding: "8px",
                      }}
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
        )}
      </Box>
    </Box>
  );
};

export default GraphEditor;
