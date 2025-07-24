import { Box, TextField, Typography, Select, MenuItem } from "@mui/material";
import { PropertyItem, SelectOption } from "./types";
import { formatDate } from "../../../utils/dateUtils";

interface PropertyRowProps extends PropertyItem {
  rowIndex: number;
  isEditing: boolean;
  onChange?: (label: string, value: string | number | null) => void;
}

const PropertyRow: React.FC<PropertyRowProps> = ({
  label,
  value,
  type = "text",
  options,
  rows = 3,
  rowIndex,
  isEditing,
  onChange,
}) => {
  const handleChange = (newValue: string | number | null) => {
    onChange?.(label, newValue);
  };

  const renderEditControl = () => {
    switch (type) {
      case "select":
        return (
          <Select
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
          >
            {options?.map((opt: SelectOption) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        );

      case "multiline":
        return (
          <TextField
            multiline
            rows={rows}
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case "json":
        return (
          <TextField
            multiline
            rows={rows}
            size="small"
            fullWidth
            value={
              value ? JSON.stringify(JSON.parse(value as string), null, 2) : ""
            }
            onChange={(e) => {
              try {
                // Validate JSON
                JSON.parse(e.target.value);
                handleChange(e.target.value);
              } catch (error) {
                // Optional: Handle invalid JSON
              }
            }}
          />
        );

      case "date":
        return (
          <TextField
            type="datetime-local"
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        );

      case "number":
        return (
          <TextField
            type="number"
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(Number(e.target.value))}
          />
        );

      default:
        return (
          <TextField
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
          />
        );
    }
  };

  const renderViewValue = () => {
    switch (type) {
      case "json":
        return value ? (
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(JSON.parse(value as string), null, 2)}
          </pre>
        ) : null;

      case "date":
        return formatDate(value as string);

      case "select":
        return options?.find((opt) => opt.id === value)?.label ?? value;

      default:
        return value;
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(120px, 30%) 1fr",
        gap: 2,
        alignItems: "center",
        bgcolor: rowIndex % 2 === 0 ? "background.default" : "background.paper",
        p: 1,
      }}
    >
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      {isEditing ? renderEditControl() : renderViewValue()}
    </Box>
  );
};

export default PropertyRow;
