import axios from "axios";
import { Node, NodeGetParams } from "../types/taxonomy"; // Corrected import path

// 1. Create the basic Axios instance.
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Define the setup function. It will add a single, clean interceptor.
export const setupAuthInterceptor = (
  getAccessTokenSilently: () => Promise<string>
) => {
  api.interceptors.request.use(
    async (config) => {
      // Get the token and add it to the request header.
      const token = await getAccessTokenSilently();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      // This only runs if there's an error setting up the request.
      return Promise.reject(error);
    }
  );
};

// 3. Define the service methods.
export const taxonomyService = {
  async getGraphList() {
    const { data } = await api.get("/taxonomy/graph/list");
    return data;
  },

  async getNode(params: NodeGetParams): Promise<Node> {
    const { data } = await api.get<Node>("/taxonomy/node/get", { params });
    return data;
  },

  async updateNode(node: Node): Promise<Node> {
    const response = await api.post<Node>("/taxonomy/node/update", node);
    return response.data;
  },
};
