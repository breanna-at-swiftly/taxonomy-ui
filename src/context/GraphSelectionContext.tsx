import { createContext, useContext, useState, ReactNode } from "react";
import type { TaxonomyGraph } from "../types/taxonomy";

interface GraphSelectionContextType {
  selectedGraphId: number | null;
  setSelectedGraphId: (id: number | null) => void;
  lastViewedGraph: TaxonomyGraph | null;
  setLastViewedGraph: (graph: TaxonomyGraph | null) => void;
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

const GraphSelectionContext = createContext<
  GraphSelectionContextType | undefined
>(undefined);

export const GraphSelectionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedGraphId, setSelectedGraphId] = useState<number | null>(null);
  const [lastViewedGraph, setLastViewedGraph] = useState<TaxonomyGraph | null>(
    null
  );
  const [currentPath, setCurrentPath] = useState<string>("/");

  return (
    <GraphSelectionContext.Provider
      value={{
        selectedGraphId,
        setSelectedGraphId,
        lastViewedGraph,
        setLastViewedGraph,
        currentPath,
        setCurrentPath,
      }}
    >
      {children}
    </GraphSelectionContext.Provider>
  );
};

export const useGraphSelection = () => {
  const context = useContext(GraphSelectionContext);
  if (!context) {
    throw new Error(
      "useGraphSelection must be used within GraphSelectionProvider"
    );
  }
  return context;
};
