import { Box, Paper, Typography } from "@mui/material";
import { propertyBoxStyles } from "../styles/propertyStyles";
// ...existing imports...

const GraphDetails: React.FC<{ graph: GraphListItem }> = ({ graph }) => {
  return (
    <Paper elevation={1} sx={propertyBoxStyles.container}>
      <Typography variant="h6" sx={propertyBoxStyles.header}>
        Graph Details
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Name */}
        <Box sx={propertyBoxStyles.propertyRow}>
          <Typography sx={propertyBoxStyles.propertyLabel}>Name</Typography>
          <Typography sx={propertyBoxStyles.propertyValue}>
            {graph.name}
          </Typography>
        </Box>

        {/* Description */}
        <Box sx={propertyBoxStyles.propertyRow}>
          <Typography sx={propertyBoxStyles.propertyLabel}>
            Description
          </Typography>
          <Typography sx={propertyBoxStyles.propertyValue}>
            {graph.description || "—"}
          </Typography>
        </Box>

        {/* Owner */}
        <Box sx={propertyBoxStyles.propertyRow}>
          <Typography sx={propertyBoxStyles.propertyLabel}>Owner</Typography>
          <Typography sx={propertyBoxStyles.propertyValue}>
            {graph.owner}
          </Typography>
        </Box>

        {/* Created Date */}
        <Box sx={propertyBoxStyles.propertyRow}>
          <Typography sx={propertyBoxStyles.propertyLabel}>Created</Typography>
          <Typography sx={propertyBoxStyles.propertyValue}>
            {new Date(graph.created_date).toLocaleString()}
          </Typography>
        </Box>

        {/* Last Modified */}
        <Box sx={propertyBoxStyles.propertyRow}>
          <Typography sx={propertyBoxStyles.propertyLabel}>Modified</Typography>
          <Typography sx={propertyBoxStyles.propertyValue}>
            {new Date(graph.last_modified).toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default GraphDetails;
