import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import type { TreeNode } from "../types/arborist";

interface NodeDetailsProps {
  node: TreeNode | null;
  isRootNode: (nodeId: string) => boolean;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({
  node,
  isRootNode,
}) => {
  console.log("NodeDetails render:", {
    hasNode: !!node,
    nodeId: node?.id,
    nodeData: node?.data,
  });

  if (!node) {
    return (
      <PropertyBox
        title="Node Properties"
        subtitle="No node selected"
        properties={[]}
      />
    );
  }

  const nodeData = node.data.data; // Access Node through TreeNodeData

  const properties = [
    { label: "ID", value: nodeData.node_id },
    { label: "Name", value: nodeData.name },
    { label: "Node Type", value: nodeData.node_type_id?.toString() || "N/A" },
    { label: "Source ID", value: nodeData.source_id || "N/A" },
    { label: "Notes", value: nodeData.notes || "N/A" },
    {
      label: "Metadata",
      value: nodeData.metadata || "N/A",
      type: "json",
    },
  ];

  return (
    <PropertyBox
      title="Node Properties"
      subtitle={isRootNode(node.id) ? "(Root Node)" : undefined}
      properties={properties}
    />
  );
};

export default NodeDetails;
