import { Box } from "@mui/material";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import type { BannerGraph } from "../types/taxonomy";

interface BannerGraphDetailsProps {
  bannerGraph: BannerGraph | null;
}

export const BannerGraphDetails: React.FC<BannerGraphDetailsProps> = ({
  bannerGraph,
}) => {
  if (!bannerGraph) return null;

  const properties = [
    { label: "Banner ID", value: bannerGraph.banner_id },
    { label: "Banner Name", value: bannerGraph.banner_name },
    { label: "Status", value: bannerGraph.graph_status_name },
    {
      label: "Published",
      value: bannerGraph.published_datetime || "Not published",
      type: "date" as const,
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <PropertyBox
        title="Banner Graph Details"
        properties={properties.map((prop, index) => ({
          ...prop,
          index,
        }))}
      />
    </Box>
  );
};
