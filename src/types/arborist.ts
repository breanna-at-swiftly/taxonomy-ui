import type { Node } from "./taxonomy";

import type { TreeNode as ArboristTreeNode } from "react-arborist";

// Extend react-arborist's TreeNode interface with our Node data
export interface TreeNodeData {
  data: Node; // Our domain model node data
}

// Use the type from react-arborist with our data type
export type TreeNode = ArboristTreeNode<TreeNodeData>;

// Helper function to create TreeNode from our Node type
export function createTreeNode(node: Node): TreeNode {
  return {
    id: node.node_id,
    name: node.name,
    children: [],
    data: { data: node },
  };
}
