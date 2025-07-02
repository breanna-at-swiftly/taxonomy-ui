export interface PropertyBoxProps {
  title: string;
  properties: PropertyItem[];
}

export interface PropertyItem {
  label: string;
  value: string | number | null;
  type?: "text" | "json" | "date";
  index?: number; // Add index for alternating rows
}
