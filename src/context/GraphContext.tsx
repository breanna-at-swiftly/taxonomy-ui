import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { taxonomyService } from "../services/taxonomyService";
import type { TaxonomyGraph } from "../types/taxonomy";

export const GraphContext = createContext<{
  graphs: TaxonomyGraph[];
  isLoading: boolean;
  error: Error | null;
  refreshGraphs: () => Promise<void>;
}>({
  graphs: [],
  isLoading: false,
  error: null,
  refreshGraphs: async () => {},
});

export const GraphProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [graphs, setGraphs] = useState<TaxonomyGraph[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshGraphs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taxonomyService.fetchGraphList();
      setGraphs(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch graphs")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshGraphs();
  }, [refreshGraphs]);

  return (
    <GraphContext.Provider value={{ graphs, isLoading, error, refreshGraphs }}>
      {children}
    </GraphContext.Provider>
  );
};

export const useGraphs = () => useContext(GraphContext);
