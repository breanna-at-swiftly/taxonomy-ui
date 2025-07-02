import { Tree } from "react-arborist";
import { useMemo } from "react";
import type { GraphExportData } from "../hooks/useGraphExport";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  data: {
    node_type_id: number;
    source_id: string;
    notes: string;
    metadata: string;
  };
}

interface TreeViewProps {
  graphData: GraphExportData;
}

export const TreeView: React.FC<TreeViewProps> = ({ graphData }) => {
  const treeData = useMemo(() => {
    // Transform graph data into tree structure
    const nodeMap = new Map(
      graphData.nodes.map((node) => [
        node.node_id,
        {
          id: node.node_id,
          name: node.name,
          children: [],
          data: {
            node_type_id: node.node_type_id,
            source_id: node.source_id,
            notes: node.notes,
            metadata: node.metadata,
          },
        },
      ])
    );

    // Build parent-child relationships
    graphData.links.forEach((link) => {
      const parent = nodeMap.get(link.from_node_id);
      const child = nodeMap.get(link.to_node_id);
      if (parent && child) {
        if (!parent.children) parent.children = [];
        parent.children.push(child);
      }
    });

    // Return array with root node as first element
    const rootNode = nodeMap.get(graphData.graph.root_node_id);
    return rootNode ? [rootNode] : []; // Convert to array for Arborist
  }, [graphData]);

  if (!treeData.length) return null;

  return (
    <Tree
      initialData={treeData} // Now passing an array
      width={800}
      height={600}
      indent={24}
      rowHeight={32}
      overscanCount={4}
    >
      {({ node, style }) => (
        <div
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            padding: "0 8px",
          }}
          onClick={() => node.toggle()}
        >
          {node.data.name}
        </div>
      )}
    </Tree>
  );
};

export default TreeView;
