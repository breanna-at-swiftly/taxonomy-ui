/**
 * API Types for Taxonomy Service
 */

export interface GraphData {
  graph_id: number;
  name: string;
  description: string;
  owner: string;
  last_modified: string;
  created_date: string;
}

export interface GraphExportData {
  graph: {
    graph_id: number;
    name: string;
    root_node_id: string;
  };
  nodes: Array<{
    node_id: string;
    name: string;
    node_type_id?: number;
    source_id?: string;
    notes?: string;
    metadata?: string;
    inserted_datetime?: string;
    updated_datetime?: string;
    updated_by?: string;
  }>;
  links: Array<{
    source: string;
    target: string;
  }>;
  rootNode: {
    node_id: string;
    name: string;
  };
}

export interface ImageUploadResponse {
  image_url: string;
}

export interface ImageUploadRequest {
  file_name: string;
  image_data: string;
  image_type: "categories";
  preserve_filename: boolean;
}

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
