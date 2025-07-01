import type { TaxonomyGraph } from "../types/taxonomy";

interface TaxonomyDetailsProps {
  selectedGraph: TaxonomyGraph | null;
}

export default function TaxonomyDetails({
  selectedGraph,
}: TaxonomyDetailsProps) {
  if (!selectedGraph) {
    return (
      <div style={{ padding: "10px" }}>
        Select a taxonomy graph to view details
      </div>
    );
  }

  const containerStyle = {
    padding: "10px",
    width: "100%",
    textAlign: "left" as const,
  };

  const rowStyle = {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: "10px",
  };

  const labelStyle = {
    width: "120px",
    fontWeight: 600,
    textAlign: "left" as const,
  };

  const valueStyle = {
    flex: 1,
    textAlign: "left" as const,
  };

  return (
    <div style={containerStyle}>
      <h2 className="text-xl font-bold mb-4" style={{ paddingLeft: "10px" }}>
        {selectedGraph.name}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={rowStyle}>
          <span style={labelStyle}>ID:</span>
          <span style={valueStyle}>{selectedGraph.graph_id}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Notes:</span>
          <span style={valueStyle}>{selectedGraph.notes}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Root Node:</span>
          <span style={valueStyle}>{selectedGraph.root_node_id}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Updated:</span>
          <span style={valueStyle}>
            {new Date(selectedGraph.updated_datetime).toLocaleString()}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Updated By:</span>
          <span style={valueStyle}>{selectedGraph.updated_by}</span>
        </div>
      </div>
    </div>
  );
}
