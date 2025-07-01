import type { TaxonomyGraph, ApiResponse } from "../types/taxonomy";

const API_BASE_URL = ""; // Empty because we're using relative URLs with the Vite proxy
const APIM_SUBSCRIPTION_KEY = "your-subscription-key-here"; // Replace with your actual key

export async function fetchTaxonomyGraphs(): Promise<
  ApiResponse<TaxonomyGraph[]>
> {
  try {
    const url = "/api/taxonomy/graph/list"; // Will be proxied through Vite
    console.log("Attempting to fetch from URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Ocp-Apim-Subscription-Key": APIM_SUBSCRIPTION_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch taxonomy graphs",
    };
  }
}
