import type { BannerGraph } from "../types/taxonomy";
import "../styles/Details.css";

interface Props {
  bannerGraph: BannerGraph | null;
}

export function BannerGraphDetails({ bannerGraph }: Props) {
  if (!bannerGraph) return null;

  return (
    <div className="details-container">
      <h3>Banner Graph Details</h3>
      <div className="details-grid">
        <div className="details-label">Banner ID:</div>
        <div className="details-value">{bannerGraph.banner_id}</div>

        <div className="details-label">Banner Name:</div>
        <div className="details-value">{bannerGraph.banner_name}</div>

        <div className="details-label">Status:</div>
        <div className="details-value">{bannerGraph.graph_status_name}</div>

        <div className="details-label">Published:</div>
        <div className="details-value">
          {bannerGraph.published_datetime || "Not published"}
        </div>
      </div>
    </div>
  );
}
