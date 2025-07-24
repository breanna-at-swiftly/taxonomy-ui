export type PropertyType =
  | "text"
  | "json"
  | "date"
  | "number"
  | "multiline"
  | "select";

export interface SelectOption {
  id: string | number;
  label: string;
}

export interface PropertyItem {
  label: string;
  value: string | number | null;
  type?: PropertyType;
  editable?: boolean;
  options?: SelectOption[];
  rows?: number; // For multiline text
}

export interface PropertyBoxProps {
  title: string;
  properties: PropertyItem[];
  isEditable?: boolean;
  onPropertyChange?: (label: string, value: string | number | null) => void;
  onSave?: (editedProperties: PropertyItem[]) => Promise<PropertyItem[]>;
  onSaveError?: (error: Error) => void; // Add error callback
}
