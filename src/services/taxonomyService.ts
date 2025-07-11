import axios from "axios";
import type { GraphData } from "../types/taxonomy";
import type {
  GraphExportData,
  ImageUploadRequest,
  ImageUploadResponse,
} from "../types/taxonomy";

export class TaxonomyService {
  private baseUrl = "/api";

  async getGraphList(): Promise<GraphData[]> {
    const response = await axios.get<GraphData[]>(
      `${this.baseUrl}/graphs/list`
    );
    return response.data;
  }

  // Add graph export method
  async getGraphExport(graphId: number): Promise<GraphExportData> {
    const response = await axios.get<GraphExportData>(
      `${this.baseUrl}/graph/${graphId}/export`
    );
    return response.data;
  }

  // Add image upload method
  async uploadImage(data: ImageUploadRequest): Promise<ImageUploadResponse> {
    const response = await axios.post(`${this.baseUrl}/image/upload`, data);
    return response.data;
  }
}

export const taxonomyService = new TaxonomyService();
