import { useState } from "react";
import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import { getNodeImage } from "../utils/nodeUtils";
import { taxonomyService } from "../services/taxonomyService";
import type { Node, PropertyItem } from "../types/taxonomy";

// Clean up interface definitions
interface ArboristNodeData {
  children: any[]; // TODO: type this properly
  data: Node;
}

// Add 'export type' to make the interface available for import
export type TaxonomyTreeNode = {
  id: string;
  children: TaxonomyTreeNode[];
  parents: TaxonomyTreeNode[];
  data: ArboristNodeData;
};

interface NodeDetailsProps {
  node: TaxonomyTreeNode;
  isRootNode: (nodeId: string) => boolean;
  onNodeUpdate?: (updatedNode: Node) => void;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({
  node,
  isRootNode,
  onNodeUpdate,
}) => {
  const nodeData = node?.data?.data || {};
  const [editedNode, setEditedNode] = useState<Partial<Node>>({});

  const handlePropertyChange = (
    label: string,
    value: string | number | null
  ) => {
    const fieldMap: Record<string, keyof Node> = {
      Name: "name",
      "Source ID": "source_id",
      Notes: "notes",
      Metadata: "metadata",
    };

    const field = fieldMap[label];
    if (field) {
      setEditedNode((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async (properties: PropertyItem[]) => {
    try {
      // Create complete node data for inspection during debugging
      const nodeToUpdate: Node = {
        ...nodeData, // Base node data
        ...editedNode, // Edited field updates
        node_id: nodeData.node_id, // Ensure critical fields
        graph_id: nodeData.graph_id,
      };

      // Now we can inspect nodeToUpdate in debugger
      const updatedNode = await taxonomyService.updateNode(nodeToUpdate);
      onNodeUpdate?.(updatedNode);
      return properties; // Return updated properties
    } catch (error) {
      console.error("Failed to update node:", error);
      throw error;
    }
  };

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
    { label: "ID", value: node?.id || "" },
    {
      label: "Name",
      value: editedNode.name ?? nodeData.name ?? "",
      editable: true,
    },
    {
      label: "Source ID",
      value: editedNode.source_id ?? nodeData.source_id ?? "",
      editable: true,
    },
    {
      label: "Notes",
      value: editedNode.notes ?? nodeData.notes ?? "",
      editable: true,
    },
    {
      label: "Image",
      value: imageUrl ?? "",
      type: "image" as PropertyType,
      editable: true,
    },
    {
      label: "Metadata",
      value: editedNode.metadata ?? nodeData.metadata ?? "",
      type: "json" as PropertyType,
      editable: true,
    },
  ];

  return (
    <PropertyBox
      title="Node Properties"
      subtitle={isRootNode(node.id) ? "(Root Node)" : undefined}
      properties={properties}
      isEditable={true}
      onPropertyChange={handlePropertyChange}
      onSave={handleSave}
      onSaveError={(error) => console.error("Save error:", error)}
    />
  );
};

export default NodeDetails;
