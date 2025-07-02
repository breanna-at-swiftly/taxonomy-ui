import { useState, useEffect } from "react";
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

export const GraphEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { graphs, isLoading: graphsLoading } = useGraphs();
  const { fetchGraphData, isLoading: exportLoading, error } = useGraphExport();

  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    null
  );
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    // Handle graph ID from URL
    const graphId = searchParams.get("graphId");
    if (graphId && graphs) {
      const graph = graphs.find((g) => g.graph_id === parseInt(graphId));
      if (graph) {
        setSelectedGraph(graph);
      }
    }
  }, [searchParams, graphs]);

  useEffect(() => {
    const loadGraphData = async () => {
      if (!selectedGraph) return;

      try {
        const data = await fetchGraphData(selectedGraph.graph_id);
        setGraphData(data);
      } catch (err) {
        console.error("Failed to load graph data:", err);
      }
    };

    loadGraphData();
  }, [selectedGraph, fetchGraphData]);

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
          display: "flex",
          alignItems: "center",
          px: 2,
          flexShrink: 0,
        }}
      >
        <Autocomplete
          value={selectedGraph}
          onChange={(_, newValue) => setSelectedGraph(newValue)}
          options={graphs || []}
          getOptionLabel={(option) => option.name}
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

      {/* Scrollable Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        {exportLoading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : !selectedGraph ? (
          <Typography>Select a graph to begin editing</Typography>
        ) : graphData ? (
          <Box sx={{ height: 600, border: 1, borderColor: "divider" }}>
            <TreeView graphData={graphData} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default GraphEditor;
