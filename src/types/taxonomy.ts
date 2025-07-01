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

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
