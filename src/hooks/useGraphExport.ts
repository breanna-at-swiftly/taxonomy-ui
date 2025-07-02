import { useState, useCallback } from "react";

export interface GraphExportData {
  nodes: Array<{
    node_id: string;
    name: string;
    node_type_id: number;
    source_id: string;
    notes: string;
    metadata: string;
  }>;
  links: Array<{
    parent_node_id: string;
    child_node_id: string;
  }>;
  graph: {
    graph_id: number;
    root_node_id: string;
  };
  rootNode: {
    node_id: string;
    name: string;
    node_type_id: number;
    source_id: string;
    notes: string;
    metadata: string;
  };
}

const graphCache = new Map<number, GraphExportData>();

export const useGraphExport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGraphData, setCurrentGraphData] =
    useState<GraphExportData | null>(null);

  const fetchGraphData = useCallback(async (graphId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      if (graphCache.has(graphId)) {
        const cachedData = graphCache.get(graphId)!;
        console.log("Using cached graph data:", graphId);
        setCurrentGraphData(cachedData);
        return cachedData;
      }

      const response = await fetch(
        `/api/taxonomy/graph/export?graph_id=${graphId}`
      );
      if (!response.ok) throw new Error("Failed to fetch graph data");

      const rawData = await response.json();
      console.log("Received raw graph data:", graphId);

      // Find root node first
      const rootNode = rawData.nodes?.find(
        (node) => node.node_id === rawData.graph.root_node_id
      );

      if (!rootNode) {
        throw new Error("Root node not found in nodes list");
      }

      // Transform raw data once
      const processedData: GraphExportData = {
        nodes: Array.isArray(rawData.nodes) ? rawData.nodes : [],
        links: Array.isArray(rawData.links) ? rawData.links : [],
        graph: rawData.graph,
        rootNode,
      };

      // Cache and set current data
      graphCache.set(graphId, processedData);
      setCurrentGraphData(processedData);

      return processedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Graph export error:", errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fetchGraphData,
    currentGraphData,
    isLoading,
    error,
    clearCache: () => graphCache.clear(),
  };
};
