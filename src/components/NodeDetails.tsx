import { PropertyBox } from "./shared/PropertyBox/PropertyBox";

// TODO: [Data Structure] Remove double-nested data objects in tree node structure
// Current structure: node.data.data.{properties}
// Target structure: node.data.{properties}
// Requires coordination with TreeView node creation and react-arborist compatibility

interface TreeNode {
  id: string;
  children: TreeNode[];
  parents: TreeNode[];
  data: {
    children: any[];
    data: {
      // Current nested structure we need to handle
      name: string;
      node_type_id?: number;
      source_id?: string;
      notes?: string;
      metadata?: string;
      inserted_datetime?: string;
      updated_datetime?: string;
      updated_by?: string;
    };
  };
}

interface NodeDetailsProps {
  node: TreeNode;
  isRootNode: (nodeId: string) => boolean;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({ node, isRootNode }) => {
  // Access the deeply nested data
  const nodeData = node?.data?.data || {};

  const properties = [
    { label: "ID", value: node?.id || "N/A" },
    { label: "Name", value: nodeData.name || "N/A" },
    { label: "Source ID", value: nodeData.source_id || "N/A" },
    { label: "Notes", value: nodeData.notes || "N/A" },
    { label: "Metadata", value: nodeData.metadata || "N/A" },
  ];

  return <PropertyBox title="Node Properties" properties={properties} />;
};

export default NodeDetails;
