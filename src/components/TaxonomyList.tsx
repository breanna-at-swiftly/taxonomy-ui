import { useEffect, useState } from "react";
import type { TaxonomyGraph } from "../types/taxonomy";
import { fetchTaxonomyGraphs } from "../services/taxonomyService";
import TaxonomyDetails from "./TaxonomyDetails";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";

const TaxonomyList: React.FC = () => {
  const [graphs, setGraphs] = useState<TaxonomyGraph[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    null
  );

  useEffect(() => {
    const loadGraphs = async () => {
      const result = await fetchTaxonomyGraphs();
      if (result.error) {
        setError(result.error);
      } else {
        // Sort graphs alphabetically by name
        const sortedGraphs = [...result.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setGraphs(sortedGraphs);
      }
      setIsLoading(false);
    };

    loadGraphs();
  }, []);

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box display="flex" gap={3}>
      {/* List Box */}
      <Box width={400}>
        <Typography variant="h6" sx={{ mb: 1, px: 1 }}>
          Taxonomy Graphs
        </Typography>
        <Paper elevation={1} sx={{ height: 500, overflow: "hidden" }}>
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
        </Paper>
      </Box>

      {/* Details Panel */}
      <Box width={600}>
        <Typography variant="h6" sx={{ mb: 1, px: 1 }}>
          Graph Details
        </Typography>
        <Paper elevation={1} sx={{ height: 500 }}>
          <TaxonomyDetails selectedGraph={selectedGraph} />
        </Paper>
      </Box>
    </Box>
  );
};

export default TaxonomyList;
