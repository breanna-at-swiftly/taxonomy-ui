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
import { useGraphs } from "../context/GraphContext";

export const GraphList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { graphs, isLoading } = useGraphs();

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
            <ListItemButton onClick={() => handleGraphSelect(graph.graph_id)}>
              <ListItemText
                primary={graph.name}
                secondary={`Graph ID: ${graph.graph_id}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GraphList;
