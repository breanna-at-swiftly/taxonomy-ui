import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { BannerGraph } from "../types/taxonomy";
import { taxonomyService } from "../services/taxonomyService";
import { GraphDetails } from "./GraphDetails";
import { BannerGraphDetails } from "./BannerGraphDetails";
import { GraphContext } from "../contexts/GraphContext";

export function GraphList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { graphs, selectedGraph, setSelectedGraph, isLoading } =
    useContext(GraphContext);
  const [bannerGraph, setBannerGraph] = useState<BannerGraph | null>(null);

  useEffect(() => {
    if (selectedGraph) {
      taxonomyService
        .fetchBannerGraphs({
          graph_id: selectedGraph.graph_id,
          graph_purpose_id: 3,
        })
        .then((bannerGraphs) => {
          setBannerGraph(bannerGraphs[0] || null);
        })
        .catch(console.error);
    } else {
      setBannerGraph(null);
    }
  }, [selectedGraph]);

  const handleGraphSelect = (graphId: number) => {
    // Get current search params and update with new graphId
    const currentParams = new URLSearchParams(location.search);
    currentParams.set("graphId", graphId.toString());

    console.log("Navigating to editor with params:", currentParams.toString());

    navigate({
      pathname: "/editor",
      search: currentParams.toString(),
    });
  };

  // Add navigation back to editor with current params
  const handleBackToEditor = () => {
    navigate({
      pathname: "/editor",
      search: location.search, // Preserve current URL parameters
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "0 auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Available Graphs
      </Typography>
      <List>
        {graphs?.map((graph) => (
          <ListItem key={graph.graph_id} disablePadding>
            <ListItemButton
              onClick={() => {
                setSelectedGraph(graph);
                handleGraphSelect(graph.graph_id);
              }}
            >
              <ListItemText
                primary={graph.name}
                secondary={`Graph ID: ${graph.graph_id}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <div className="details-section">
        <GraphDetails graph={selectedGraph} />
        <BannerGraphDetails bannerGraph={bannerGraph} />
      </div>
    </Box>
  );
}

export default GraphList;
