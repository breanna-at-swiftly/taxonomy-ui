import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGraphList } from "../hooks/useGraphList";
import type { TaxonomyGraph } from "../hooks/useGraphList";
import { BANNER_COLOR } from "../theme/theme";

const TaxonomyList: React.FC = () => {
  const navigate = useNavigate();
  const { graphs, isLoading, error, fetchGraphs } = useGraphList();
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    null
  );

  useEffect(() => {
    fetchGraphs();
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 3, width: "100%", m: 0, p: 0 }}>
      <Box sx={{ width: 400, flexShrink: 0 }}>
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
                      color: BANNER_COLOR,
                      backgroundColor: "rgba(139, 75, 98, 0.04)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Refresh Graph List">
              <IconButton
                size="small"
                onClick={fetchGraphs}
                disabled={isLoading}
                sx={{
                  color: "rgba(0, 0, 0, 0.54)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    color: BANNER_COLOR,
                    backgroundColor: "rgba(139, 75, 98, 0.04)",
                  },
                  "&.Mui-disabled": {
                    color: "rgba(0, 0, 0, 0.26)",
                  },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Paper elevation={1} sx={{ height: 500, overflow: "hidden" }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" p={2}>
              {error}
            </Typography>
          ) : (
            <List sx={{ height: "100%", overflow: "auto" }}>
              {graphs.map((graph) => (
                <ListItem
                  key={graph.graph_id}
                  selected={selectedGraph?.graph_id === graph.graph_id}
                  onClick={() => setSelectedGraph(graph)}
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
    </Box>
  );
};

export default TaxonomyList;
