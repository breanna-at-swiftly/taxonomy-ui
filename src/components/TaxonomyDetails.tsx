import { Box } from "@mui/material";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import type { TaxonomyGraph } from "../types/taxonomy";

interface TaxonomyDetailsProps {
  selectedGraph: TaxonomyGraph | null;
}

const TaxonomyDetails: React.FC<TaxonomyDetailsProps> = ({ selectedGraph }) => {
  if (!selectedGraph) return null;

  const properties = [
    { label: "Graph ID", value: selectedGraph.graph_id },
    { label: "Name", value: selectedGraph.name },
    { label: "Notes", value: selectedGraph.notes || "—" },
    { label: "Updated By", value: selectedGraph.updated_by },
    {
      label: "Created",
      value: selectedGraph.inserted_datetime,
      type: "date" as const,
    },
    {
      label: "Modified",
      value: selectedGraph.updated_datetime,
      type: "date" as const,
    },
  ];

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <PropertyBox
        title="Graph Details"
        properties={properties.map((prop, index) => ({
          ...prop,
          index,
        }))}
      />
    </Box>
  );
};

export default TaxonomyDetails;
