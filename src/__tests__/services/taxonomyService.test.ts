import { describe, it, expect, beforeEach, vi } from "vitest";
import { taxonomyService } from "../../services/taxonomyService";

// Setup axios mock with inline factory
vi.mock("axios", () => {
  // Create mock function inside the factory
  const get = vi.fn();
  const post = vi.fn();
  // Store reference to access in tests
  (vi as any).__mockGet = get;
  (vi as any).__mockPost = post;

  return {
    default: {
      create: () => ({
        get,
        post,
      }),
    },
  };
});

// Get reference to mock function
const mockGet = (vi as any).__mockGet;
const mockPost = (vi as any).__mockPost;

describe("taxonomyService", () => {
  describe("fetchBannerGraphs", () => {
    const mockSuccessResponse = [
      {
        banner_graph_id: 2,
        banner_id: "A4C3DA6A-9072-44A7-B83C-9D1227D08037",
        tenant_id: "hlnd",
        banner_name: "Homeland",
        graph_id: 100,
        graph_name: "Homeland Product Taxonomy",
        node_id: null,
        graph_purpose_id: 3,
        graph_purpose_name: "PRODUCT_COUPON_CATEGORIES",
        graph_status_id: 5,
        graph_status_name: "READY_PRODUCTION",
        published_datetime: "2025-03-31T22:03:45",
        inserted_datetime: "2024-03-08T16:52:27",
        updated_datetime: "2025-03-31T22:03:45.450000",
        updated_by: "abelinko@swiftly.com",
      },
    ];

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("fetches banner graph for known graph_id and product category purpose", async () => {
      // Setup
      const params = {
        graph_id: 100,
        graph_purpose_id: 3, // PRODUCT_COUPON_CATEGORIES
      };

      mockGet.mockResolvedValue({ data: mockSuccessResponse });

      // Execute
      const result = await taxonomyService.fetchBannerGraphs(params);

      // Verify
      expect(mockGet).toHaveBeenCalledWith("/taxonomy/banner-graph/get", {
        params,
      });
      expect(result).toEqual(mockSuccessResponse);
      expect(result[0].graph_id).toBe(100);
      expect(result[0].graph_purpose_id).toBe(3);
    });

    it("returns empty array for non-existent graph_id", async () => {
      // Setup
      const params = {
        graph_id: 0,
        graph_purpose_id: 3,
      };

      mockGet.mockResolvedValue({ data: [] });

      // Execute
      const result = await taxonomyService.fetchBannerGraphs(params);

      // Verify
      expect(mockGet).toHaveBeenCalledWith("/taxonomy/banner-graph/get", {
        params,
      });
      expect(result).toEqual([]);
    });
  });

  describe("getNode", () => {
    const mockNode: Node = {
      node_id: "B232D8F7-A2E2-448B-B486-D972EA116E9A",
      graph_id: 100,
      name: "Biscuits & Pie Crusts",
      source_id: "Product/biscuits-and-pie-crusts-X",
      // Add other required fields with placeholder values
      node_type_id: 1,
      notes: "junk in here",
      updated_by: "system",
    };

    it("fetches node by node_id", async () => {
      mockGet.mockResolvedValue({ data: mockNode });

      const result = await taxonomyService.getNode({
        node_id: "B232D8F7-A2E2-448B-B486-D972EA116E9A",
      });

      expect(mockGet).toHaveBeenCalledWith("/taxonomy/node/get", {
        params: { node_id: "B232D8F7-A2E2-448B-B486-D972EA116E9A" },
      });
      expect(result).toEqual(mockNode);
    });

    it("fetches node by graph_id and source_id", async () => {
      mockGet.mockResolvedValue({ data: mockNode });

      const result = await taxonomyService.getNode({
        graph_id: 100,
        source_id: "Product/biscuits-and-pie-crusts",
      });

      expect(mockGet).toHaveBeenCalledWith("/taxonomy/node/get", {
        params: {
          graph_id: 100,
          source_id: "Product/biscuits-and-pie-crusts",
        },
      });
      expect(result).toEqual(mockNode);
    });
  });

  describe("updateNode", () => {
    const mockNode: Node = {
      node_id: "B232D8F7-A2E2-448B-B486-D972EA116E9A",
      graph_id: 100,
      name: "Biscuits & Pie Crusts",
      source_id: "Product/biscuits-and-pie-crusts",
      node_type_id: 1,
      notes: "Updated notes",
      updated_by: "test_user",
    };

    it("updates node successfully", async () => {
      const mockResponse = { ...mockNode };
      mockPost.mockResolvedValue({ data: mockResponse });

      const result = await taxonomyService.updateNode(mockNode);

      expect(mockPost).toHaveBeenCalledWith("/taxonomy/node/update", mockNode);
      expect(result).toEqual(mockResponse);
    });
  });
});
