import { useState } from "react";
import type { TaxonomyGraph } from "../types/taxonomy";
import { useGraphs } from "../context/GraphContext";
import TaxonomyDetails from "./TaxonomyDetails";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const TaxonomyList: React.FC = () => {
  const { graphs, isLoading, error, refreshGraphs } = useGraphs();
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    null
  );

  const handleGraphSelect = (graph: TaxonomyGraph) => {
    setSelectedGraph(graph);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        width: "100%",
        m: 0,
        p: 0,
      }}
    >
      {/* List Box */}
      <Box
        sx={{
          width: 400,
          flexShrink: 0,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6">Taxonomy Graphs</Typography>
          <Box display="flex" gap={1}>
            <Tooltip title="Edit Selected Graph">
              <span>
                <IconButton
                  size="small"
                  onClick={() =>
                    selectedGraph &&
                    navigate(`/editor?graphId=${selectedGraph.graph_id}`)
                  }
                  disabled={!selectedGraph}
                  sx={{
                    color: "rgba(0, 0, 0, 0.54)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      color: "BANNER_COLOR",
                      backgroundColor: "rgba(139, 75, 98, 0.04)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" sx={{ width: 20, height: 20 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Refresh graphs list">
              <span>
                <IconButton
                  size="small"
                  onClick={refreshGraphs}
                  disabled={isLoading}
                  sx={{
                    color: "rgba(0, 0, 0, 0.54)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      color: "BANNER_COLOR",
                      backgroundColor: "rgba(139, 75, 98, 0.04)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                    animation: isLoading ? "spin 1s linear infinite" : "none",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                >
                  <RefreshIcon
                    fontSize="small"
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
        <Paper
          elevation={1}
          sx={{
            height: 500,
            overflow: "hidden",
          }}
        >
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List sx={{ height: "100%", overflow: "auto" }}>
              {graphs.map((graph) => (
                <ListItem
                  key={graph.graph_id}
                  selected={selectedGraph?.graph_id === graph.graph_id}
                  onClick={() => handleGraphSelect(graph)}
                  sx={{
                    cursor: "pointer",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ListItemText
                    primary={graph.name}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: 14,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>

      {/* Details Panel */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 600,
          backgroundColor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            height: 500,
            overflow: "auto",
          }}
        >
          <TaxonomyDetails selectedGraph={selectedGraph} />
        </Paper>
      </Box>
    </Box>
  );
};

export default TaxonomyList;
