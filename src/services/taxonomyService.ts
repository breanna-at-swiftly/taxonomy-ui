import type { GraphResponse } from "../types/taxonomy";

const API_BASE = "/api";

export async function fetchTaxonomyGraphs(): Promise<GraphResponse> {
  try {
    const response = await fetch(`${API_BASE}/taxonomy/graphs`);
    if (!response.ok) throw new Error("Failed to fetch graphs");
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
