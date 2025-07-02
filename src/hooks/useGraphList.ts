import { useState } from 'react';

export interface TaxonomyGraph {
  graph_id: number;
  name: string;
  notes?: string;
  inserted_datetime: string;
  updated_datetime: string;
}

export function useGraphList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graphs, setGraphs] = useState<TaxonomyGraph[]>([]);

  const fetchGraphs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/taxonomy/graphs');
      if (!response.ok) throw new Error('Failed to fetch graphs');
      
      const data = await response.json();
      const sortedGraphs = [...data].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setGraphs(sortedGraphs);
      return sortedGraphs;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    graphs,
    isLoading,
    error,
    fetchGraphs
  };
}