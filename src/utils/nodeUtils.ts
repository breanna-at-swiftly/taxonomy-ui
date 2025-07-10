export const extractNodeImage = (metadata: string | null): string | null => {
  if (!metadata) return null;

  try {
    const parsedMetadata = JSON.parse(metadata);
    return parsedMetadata.image_url || null;
  } catch (e) {
    console.warn("Failed to parse node metadata:", e);
    return null;
  }
};

export const hasImageUrl = (metadata: any): boolean => {
  return (
    metadata &&
    typeof metadata === "object" &&
    ("image_url" in metadata || "imageUrl" in metadata)
  );
};

export const getNodeImage = (metadata: any): string | null => {
  if (!metadata || typeof metadata !== "object") return null;
  return metadata.image_url || metadata.imageUrl || null;
};
