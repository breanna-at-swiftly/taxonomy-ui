// Existing interface - keep for now to prevent breaking changes
export interface TaxonomyGraph {
  graph_id: number;
  topology_id: number;
  name: string;
  notes: string;
  root_node_id: string;
  inserted_datetime: string;
  updated_datetime: string;
  updated_by: string;
}

// describes the graph overall.
export interface Graph {
  graph_id: number;
  topology_id: number;
  name: string;
  notes: string;
  root_node_id: string;
  inserted_datetime: string;
  updated_datetime: string;
  updated_by: string;
}

// New interfaces based on API spec
export interface Link {
  link_id: string;
  link_type_id: number;
  from_graph_id: number;
  from_node_id: string;
  from_source_id: string;
  to_graph_id: number;
  to_node_id: string;
  to_source_id: string;
  link_order: number;
  metadata: string;
  valid_from_datetime: string;
  valid_until_datetime: string;
  is_disabled: boolean;
}

export interface Node {
  node_id: string;
  node_type_id: number;
  graph_id: number;
  source_id: string;
  name: string;
  notes: string;
  metadata: string;
  inserted_datetime: string;
  updated_datetime: string;
  updated_by: string;
}

// Keep existing GraphData interface but mark as deprecated
/** @deprecated Use TaxonomyGraphData instead */
export interface GraphData {
  graph: TaxonomyGraph;
  nodes: TreeNode[];
  links: Array<{
    source: string;
    target: string;
  }>;
}

// The graph as exported with all nodes and links.
export interface GraphDataEx {
  graph: Graph;
  nodes: Node[];
  links: Link[];
  rootNode?: Node;
}
