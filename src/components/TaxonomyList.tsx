import { useEffect, useState } from "react";
import type { TaxonomyGraph } from "../types/taxonomy";
import { fetchTaxonomyGraphs } from "../services/taxonomyService";
import TaxonomyDetails from "./TaxonomyDetails";

const TaxonomyList: React.FC = () => {
  const [graphs, setGraphs] = useState<TaxonomyGraph[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGraph, setSelectedGraph] = useState<TaxonomyGraph | null>(
    null
  );

  useEffect(() => {
    const loadGraphs = async () => {
      const result = await fetchTaxonomyGraphs();
      if (result.error) {
        setError(result.error);
      } else {
        // Sort graphs alphabetically by name
        const sortedGraphs = [...result.data].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setGraphs(sortedGraphs);
      }
      setIsLoading(false);
    };

    loadGraphs();
  }, []);

  if (isLoading) return <div className="p-4">Loading taxonomy graphs...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div style={{ display: "flex", gap: "24px", position: "relative" }}>
      {/* List Box */}
      <div style={{ width: "400px", flexShrink: 0 }}>
        <h2 className="text-lg font-semibold mb-2 px-2">Taxonomy Graphs</h2>
        <div
          style={{
            border: "1px solid #ccc",
            height: "500px",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              flex: 1,
            }}
          >
            {graphs.map((graph) => (
              <div
                key={graph.graph_id}
                className={`
                  hover:bg-gray-50
                  ${
                    selectedGraph?.graph_id === graph.graph_id
                      ? "bg-blue-50"
                      : ""
                  }
                `}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  borderBottom: "1px solid #eee",
                  fontSize: "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "left",
                }}
                onClick={() => setSelectedGraph(graph)}
              >
                {graph.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details Panel with Header */}
      <div style={{ width: "600px", flexShrink: 0 }}>
        <h2 className="text-lg font-semibold mb-2 px-2">Graph Details</h2>
        <div
          style={{
            border: "1px solid #ccc",
            height: "500px",
            backgroundColor: "white",
          }}
        >
          <TaxonomyDetails selectedGraph={selectedGraph} />
        </div>
      </div>
    </div>
  );
};

export default TaxonomyList;
