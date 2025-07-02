import { useState, useCallback } from "react";

export interface GraphExportData {
  graph: {
    graph_id: number;
    topology_id: number;
    name: string;
    notes: string;
    root_node_id: string;
    inserted_datetime: string;
    updated_datetime: string;
    updated_by: string;
  };
  nodes: Array<{
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
  }>;
  links: Array<{
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
  }>;
}

const graphCache = new Map<number, GraphExportData>();

export const useGraphExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGraphData = useCallback(async (graphId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      if (graphCache.has(graphId)) {
        setIsLoading(false);
        return graphCache.get(graphId)!;
      }

      const response = await fetch(
        `/api/taxonomy/graph/export?graph_id=${graphId}`
      );
      if (!response.ok) throw new Error("Failed to fetch graph data");

      const data: GraphExportData = await response.json();

      // Cache the result
      graphCache.set(graphId, data);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchGraphData,
    isLoading,
    error,
    clearCache: () => graphCache.clear(),
  };
};
