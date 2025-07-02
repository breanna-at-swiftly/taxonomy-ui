import { useState, useEffect } from "react";
import axios from "axios";
interface GraphListItem {
  graph_id: number;
  name: string;
  description: string;
  owner: string;
  last_modified: string;
  created_date: string;
}
export const useGraphList = () => {
  const [graphs, setGraphs] = useState<GraphListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const fetchGraphs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<GraphListItem[]>("/api/graphs");
        setGraphs(response.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch graphs")
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGraphs();
  }, []);
  const refreshGraphs = () => {
    setLoading(true);
    fetchGraphs();
  };
  return { graphs, loading, error, refreshGraphs };
};

export type { GraphListItem };
