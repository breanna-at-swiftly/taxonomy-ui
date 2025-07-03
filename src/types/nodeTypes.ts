export enum NodeType {
  Generic = 0,
  Root = 1,
  ProductCategory = 3,
  CouponCategory = 4,
}

interface CategoryMetadata {
  image_url?: string;
}

export function isCategoryNode(nodeTypeId: number): boolean {
  return (
    nodeTypeId === NodeType.ProductCategory ||
    nodeTypeId === NodeType.CouponCategory
  );
}

export function extractCategoryImage(
  metadata: string | undefined
): string | null {
  if (!metadata) return null;
  try {
    const parsed = JSON.parse(metadata) as CategoryMetadata;
    return parsed.image_url || null;
  } catch {
    return null;
  }
}
