import axios from "axios";
import type {
  Graph,
  GraphExportResponse,
  BannerGraph,
  Node,
} from "../types/taxonomy";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request/response interceptors for debugging
api.interceptors.request.use((request) => {
  console.log("API Request:", {
    url: request.url,
    method: request.method,
    data: request.data,
    baseURL: request.baseURL,
  });
  return request;
});

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

interface NodeGetParams {
  node_id?: string;
  graph_id?: number;
  source_id?: string;
}

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

  /**
   * Get a node by either node_id or graph_id + source_id combination
   * @param params NodeGetParams
   * @returns Promise<Node>
   * @throws Error if neither node_id nor (graph_id + source_id) are provided
   */
  async getNode(params: NodeGetParams): Promise<Node> {
    if (!params.node_id && !(params.graph_id && params.source_id)) {
      throw new Error(
        "Either node_id or both graph_id and source_id must be provided"
      );
    }

    const { data } = await api.get<Node>("/taxonomy/node/get", {
      params: {
        node_id: params.node_id,
        graph_id: params.graph_id,
        source_id: params.source_id,
      },
    });
    return data;
  },

  /**
   * Update a taxonomy node
   * @param node Node object containing all fields to update
   * @returns Promise<Node> Updated node details
   */
  async updateNode(node: Node): Promise<Node> {
    // Log the outgoing request
    console.log("UpdateNode Request:", {
      url: "/taxonomy/node/update",
      payload: node,
    });

    try {
      const response = await api.post<Node>("/taxonomy/node/update", node);
      // console.log("calling node/update");
      // const body = '{ "node_id": "something" }';
      // const response = await api.post("/taxonomy/node/update", body);

      // Log the response
      console.log("UpdateNode Response:", {
        status: response.status,
        data: response.data || "(empty)",
      });

      if (!response.data) {
        throw new Error("Empty response data received");
      }

      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("UpdateNode Error:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      throw error;
    }
  },
};
