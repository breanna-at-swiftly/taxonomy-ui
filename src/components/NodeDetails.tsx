import { Box } from "@mui/material";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import type { TreeNode } from "../types/tree";

interface NodeDetailsProps {
  selectedNode: TreeNode | null;
  isRootNode: (nodeId: string) => boolean;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
  selectedNode,
  isRootNode,
}) => {
  if (!selectedNode) return null;

  const isRoot = isRootNode(selectedNode.id);

  const properties = [
    {
      label: "Name",
      value: isRoot ? "ROOT" : selectedNode.data.name,
    },
    {
      label: "Source ID",
      value: selectedNode.data.source_id,
    },
    {
      label: "Notes",
      value: selectedNode.data.notes,
    },
    {
      label: "Metadata",
      value: selectedNode.data.metadata,
      type: "json" as const,
    },
  ];

  return (
    <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
      <PropertyBox
        title="Node Details"
        properties={properties.map((prop, index) => ({
          ...prop,
          index,
        }))}
      />
    </Box>
  );
};

export default NodeDetails;
