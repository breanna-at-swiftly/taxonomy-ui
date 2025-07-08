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
