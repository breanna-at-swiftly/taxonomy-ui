import axios from "axios";
import type { TaxonomyGraph } from "../types/taxonomy";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const taxonomyService = {
  fetchGraphList(): Promise<TaxonomyGraph[]> {
    return api
      .get<TaxonomyGraph[]>("/taxonomy/graph/list")
      .then((response) => response.data);
  },
};
