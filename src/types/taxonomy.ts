export interface TaxonomyGraph {
  graph_id: number;
  name: string;
  notes?: string;
  inserted_datetime: string;
  updated_datetime: string;
}

export interface GraphResponse {
  data: TaxonomyGraph[];
  error?: string;
}
