import axios from "axios";
import type { Graph, GraphExportResponse } from "../types/taxonomy";

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
      .get<GraphExportResponse>(`/taxonomy/graph/${graphId}/export`)
      .then((response) => response.data);
  },
};
