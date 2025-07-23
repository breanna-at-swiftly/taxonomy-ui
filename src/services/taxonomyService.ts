import axios from "axios";
import type {
  Graph,
  GraphExportResponse,
  BannerGraph,
} from "../types/taxonomy";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const taxonomyService = {
  fetchGraphList(): Promise<Graph[]> {
    return api
      .get<Graph[]>("/taxonomy/graph/list")
      .then((response) => response.data);
  },

  fetchGraphExport(graphId: number): Promise<GraphExportResponse> {
    return api
      .get<GraphExportResponse>("/taxonomy/graph/export", {
        params: { graph_id: graphId },
      })
      .then((response) => {
        const data = response.data;
        // Find root node from nodes array using graph.root_node_id
        const rootNode = data.nodes.find(
          (node) => node.node_id === data.graph.root_node_id
        );

        if (!rootNode) {
          throw new Error(
            `Root node ${data.graph.root_node_id} not found in nodes`
          );
        }

        // Return modified response with rootNode
        return {
          ...data,
          rootNode,
        };
      });
  },

  async fetchBannerGraphs(params?: {
    graph_id?: number;
    graph_purpose_id?: number;
  }): Promise<BannerGraph[]> {
    const response = await api.get<BannerGraph[]>(
      "/taxonomy/banner-graph/get",
      {
        params,
      }
    );
    return response.data;
  },
};
