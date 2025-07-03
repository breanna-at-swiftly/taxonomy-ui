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

export const GraphEditor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { graphs, isLoading: graphsLoading } = useGraphs();
  const { fetchGraphData, isLoading: exportLoading } = useGraphExport();
  const [graphData, setGraphData] = useState<GraphExportData | null>(null);

  // Initialize selectedGraph from URL params
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    () => {
      const graphId = searchParams.get("graphId");
      return null; // Let the effect handle initial selection
    }
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
        setSelectedGraph(graph);
      }
    }
  }, [searchParams, graphs]); // Keep clean dependency array

  // Handle graph selection
  const handleGraphSelect = useCallback(
    (newGraph: TaxonomyGraph | null) => {
      console.log("Selected new graph:", newGraph?.name);
      setSelectedGraph(newGraph);

      if (newGraph) {
        setSearchParams({ graphId: newGraph.graph_id.toString() });
      } else {
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

    fetchGraphData(selectedGraph.graph_id)
      .then((data) => {
        console.log("Fetched new graph data:", data);
        setGraphData(data);
      })
      .catch((err) => console.error("Failed to load graph data:", err));
  }, [selectedGraph?.graph_id, fetchGraphData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Fixed Toolbar */}
      <Box
        sx={{
          height: 48,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: BANNER_COLOR,
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
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <ErrorBoundary>
          {graphData && <TreeView graphData={graphData} />}
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default GraphEditor;
