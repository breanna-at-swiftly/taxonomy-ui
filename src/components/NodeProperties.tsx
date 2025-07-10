import { Box, Typography } from "@mui/material";
import { hasImageUrl, getNodeImage } from "../utils/nodeUtils";

export const NodeProperties: React.FC<{ node: any }> = ({ node }) => {
  const imageUrl = node.metadata ? getNodeImage(node.metadata) : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Node Properties
      </Typography>

      {/* Display basic properties */}
      <Typography>
        <strong>Name:</strong> {node.name}
      </Typography>
      <Typography>
        <strong>ID:</strong> {node.node_id}
      </Typography>

      {/* Display metadata section */}
      <Typography sx={{ mt: 2 }} variant="subtitle1">
        Metadata:
      </Typography>
      {imageUrl ? (
        // Display image if available
        <Box sx={{ mt: 1, mb: 2 }}>
          <img
            src={imageUrl}
            alt={node.name}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 4,
            }}
          />
        </Box>
      ) : (
        // Display formatted JSON if no image
        <Box
          component="pre"
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: "grey.100",
            borderRadius: 1,
            overflow: "auto",
          }}
        >
          {JSON.stringify(node.metadata, null, 2)}
        </Box>
      )}
    </Box>
  );
};
