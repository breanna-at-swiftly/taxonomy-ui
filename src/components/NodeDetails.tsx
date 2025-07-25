import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import { getNodeImage } from "../utils/nodeUtils";
import type { Node } from "../types/taxonomy";

interface ArboristNodeData {
  children: any[]; // TODO: type this properly
  data: Node; // Use existing Node interface
}

export interface TaxonomyTreeNode {
  id: string;
  children: TaxonomyTreeNode[];
  parents: TaxonomyTreeNode[];
  data: ArboristNodeData;
}

interface NodeDetailsProps {
  node: TaxonomyTreeNode;
  isRootNode: (nodeId: string) => boolean;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({
  node,
  isRootNode,
}) => {
  const nodeData = node?.data?.data || {};

  // Parse metadata string into JSON, handle potential parsing errors
  const metadata = (() => {
    try {
      return nodeData.metadata ? JSON.parse(nodeData.metadata) : null;
    } catch (e) {
      console.warn("Failed to parse node metadata:", e);
      return null;
    }
  })();

  // Get image URL from parsed metadata
  const imageUrl = metadata ? getNodeImage(metadata) : null;

  const properties = [
    { label: "ID", value: node?.id || "N/A" },
    { label: "Name", value: nodeData.name || "N/A" },
    { label: "Source ID", value: nodeData.source_id || "N/A" },
    { label: "Notes", value: nodeData.notes || "N/A" },
    {
      label: "Image",
      value: imageUrl,
      type: "image" as PropertyType,
      editable: true,
    },
    {
      label: "Metadata",
      value: nodeData.metadata || "N/A",
      type: "json" as PropertyType,
      editable: true,
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
