import { PropertyBox } from "./shared/PropertyBox/PropertyBox";
import { getNodeImage } from "../utils/nodeUtils";
import { ImageUploadModal } from "./ImageUploadModal";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";

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
      label: "Metadata",
      value:
        imageUrl != null ? (
          <img
            src={imageUrl}
            alt={nodeData.name}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: 4,
            }}
          />
        ) : (
          // Show original metadata string if no image or parsing failed
          nodeData.metadata || "N/A"
        ),
    },
  ];

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleImageUploadSuccess = (imageUrl: string) => {
    // TODO: Update node metadata with new image URL
    console.log("Image uploaded:", imageUrl);
  };

  return (
    <>
      <PropertyBox
        title="Node Properties"
        subtitle={isRootNode(node.id) ? "(Root Node)" : undefined}
        properties={properties}
        actions={
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Image
          </Button>
        }
      />

      <ImageUploadModal
        open={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleImageUploadSuccess}
      />
    </>
  );
};

export default NodeDetails;
