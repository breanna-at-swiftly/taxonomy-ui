/**
 * Formats a date string into a localized format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error("Invalid date string:", dateString);
    return dateString; // Return original string if parsing fails
  }
};
