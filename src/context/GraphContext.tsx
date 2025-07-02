import { createContext, useContext, useState, useEffect } from "react";
import { fetchTaxonomyGraphs } from "../services/taxonomyService";
import type { TaxonomyGraph } from "../types/taxonomy";

interface GraphContextType {
  graphs: TaxonomyGraph[] | null;
  isLoading: boolean;
  error: string | undefined;
  refreshGraphs: () => Promise<void>;
}

const GraphContext = createContext<GraphContextType | undefined>(undefined);

export function GraphProvider({ children }: { children: React.ReactNode }) {
  const [graphs, setGraphs] = useState<TaxonomyGraph[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadGraphs = async () => {
    setIsLoading(true);
    const result = await fetchTaxonomyGraphs();
    if (result.error) {
      setError(result.error);
    } else {
      const sortedGraphs = [...result.data].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      setGraphs(sortedGraphs);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadGraphs();
  }, []);

  return (
    <GraphContext.Provider
      value={{
        graphs,
        isLoading,
        error,
        refreshGraphs: loadGraphs,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraphs() {
  const context = useContext(GraphContext);
  if (context === undefined) {
    throw new Error("useGraphs must be used within a GraphProvider");
  }
  return context;
}
