import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  useTheme,
  Card,
  CardContent,
} from "@mui/material";
import type { TaxonomyGraph } from "../types/taxonomy";

interface TaxonomyDetailsProps {
  selectedGraph: TaxonomyGraph | null;
}

export default function TaxonomyDetails({
  selectedGraph,
}: TaxonomyDetailsProps) {
  const theme = useTheme();

  if (!selectedGraph) {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary" variant="body1">
            Select a taxonomy graph to view details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const DetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <Grid item xs={12}>
      <Box
        display="flex"
        alignItems="flex-start"
        px={1}
        py={0.5}
        sx={{
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            width: 120,
            fontWeight: 600,
            textAlign: "left",
            color: "text.secondary",
          }}
        >
          {label}:
        </Typography>
        <Typography
          variant="body1"
          sx={{
            ml: 2,
            flex: 1,
            wordBreak: "break-word",
          }}
        >
          {value}
        </Typography>
      </Box>
    </Grid>
  );

  return (
    <Card>
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          color="primary"
          sx={{ fontWeight: "medium" }}
        >
          {selectedGraph.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <DetailRow label="ID" value={selectedGraph.graph_id} />
          <DetailRow label="Notes" value={selectedGraph.notes || "-"} />
          <DetailRow label="Root Node" value={selectedGraph.root_node_id} />
          <DetailRow
            label="Updated"
            value={new Date(selectedGraph.updated_datetime).toLocaleString()}
          />
          <DetailRow label="Updated By" value={selectedGraph.updated_by} />
        </Grid>
      </CardContent>
    </Card>
  );
}
