import { createContext, useContext, useState, useEffect } from "react";
import { taxonomyService } from "../services/taxonomyService";
import type { GraphData } from "../types/taxonomy";

export const GraphContext = createContext<{
  graphs: GraphData[];
  loading: boolean;
  error: Error | null;
  refreshGraphs: () => Promise<void>;
}>({
  graphs: [],
  loading: false,
  error: null,
  refreshGraphs: async () => {},
});

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGraphs = async () => {
    try {
      setLoading(true);
      const graphList = await taxonomyService.getGraphList();
      setGraphs(graphList);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch graphs")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphs();
  }, []);

  return (
    <GraphContext.Provider
      value={{ graphs, loading, error, refreshGraphs: fetchGraphs }}
    >
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphs = () => useContext(GraphContext);
