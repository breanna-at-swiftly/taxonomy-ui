import { useState, useEffect } from "react";
import { taxonomyService } from "../services/taxonomyService";
import type { GraphExportData } from "../types/export";

export const useGraphExport = (graphId: number) => {
  const [data, setData] = useState<GraphExportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGraphData = async () => {
    try {
      setLoading(true);
      const exportData = await taxonomyService.getGraphExport(graphId);
      setData(exportData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch graph data")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraphData();
  }, [graphId]);

  return { data, loading, error, refreshData: fetchGraphData };
};
