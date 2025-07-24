import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Remove useLocation
import type { Graph, BannerGraph } from "../types/taxonomy";
import { useGraphs } from "../context/GraphContext";
import TaxonomyDetails from "./TaxonomyDetails";
import { BannerGraphDetails } from "./BannerGraphDetails";
import { taxonomyService } from "../services/taxonomyService";
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

const GraphList: React.FC = () => {
  const navigate = useNavigate();
  const { graphs, isLoading, error, refreshGraphs } = useGraphs();
  const [selectedGraph, setSelectedGraph] = useState<Graph | null>(null);
  const [bannerGraph, setBannerGraph] = useState<BannerGraph | null>(null);
  const [isBannerLoading, setIsBannerLoading] = useState(false); // Loading state for banner graph

  useEffect(() => {
    // Clear banner graph immediately when selection changes
    setBannerGraph(null);

    if (selectedGraph) {
      setIsBannerLoading(true);
      taxonomyService
        .fetchBannerGraphs({
          graph_id: selectedGraph.graph_id,
          graph_purpose_id: 3,
        })
        .then((bannerGraphs) => {
          setBannerGraph(bannerGraphs[0] || null);
        })
        .catch(console.error)
        .finally(() => setIsBannerLoading(false));
    }
  }, [selectedGraph]);

  const handleGraphSelect = (graph: Graph) => {
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
            minHeight: 500, // Changed from fixed height to minHeight
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2,
          }}
        >
          <TaxonomyDetails selectedGraph={selectedGraph} />

          {/* Banner Graph Section with State Handling */}
          {selectedGraph && (
            <>
              {isBannerLoading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 2,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              ) : bannerGraph ? (
                <BannerGraphDetails
                  bannerGraph={bannerGraph}
                  onEdit={() =>
                    navigate(`/editor?graphId=${bannerGraph.graph_id}`)
                  }
                />
              ) : (
                <Box sx={{ p: 2 }}>
                  <Typography color="text.secondary">
                    No banner graph associated with this taxonomy graph
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default GraphList;
