/**
 * Core domain types
 */
export interface Graph {
  graph_id: number;
  topology_id: number;
  name: string;
  notes?: string;
  root_node_id: string;
  inserted_datetime: string;
  updated_datetime: string;
  updated_by: string;
}

export interface Node {
  node_id: string;
  node_type_id?: number;
  source_id?: string;
  notes?: string;
  metadata?: string;
  inserted_datetime?: string;
  updated_datetime?: string;
  updated_by?: string;
}

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
  metadata?: string;
  valid_from_datetime?: string;
  valid_until_datetime?: string;
  is_disabled: boolean;
}

/**
 * API Response types
 */
export interface GraphExportResponse {
  graph: Graph;
  nodes: Node[];
  links: Link[];
  rootNode: Node;
}

export interface BannerGraph {
  banner_graph_id: number;
  banner_id: string;
  tenant_id: string;
  banner_name: string;
  graph_id: number;
  graph_name: string;
  node_id: string | null;
  graph_purpose_id: number;
  graph_purpose_name: string;
  graph_status_id: number;
  graph_status_name: string;
  published_datetime: string | null;
  inserted_datetime: string;
  updated_datetime: string;
  updated_by: string;
}
