export interface NodeData {
  id: string; // Include ID since this may be used independently
  name: string;
  node_type_id?: number;
  source_id?: string;
  notes?: string;
  metadata?: string;
}

export interface TreeNode {
  id: string; // Duplicate for tree operations, matches NodeData.id
  children: TreeNode[];
  parents: TreeNode[];
  data: NodeData;
}
