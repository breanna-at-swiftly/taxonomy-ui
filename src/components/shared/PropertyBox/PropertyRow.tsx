import { Box, TextField, Typography, Select, MenuItem } from "@mui/material";
import type { PropertyItem, SelectOption, PropertyType } from "./types";
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

      case "image":
        return (
          <TextField
            size="small"
            fullWidth
            value={value ?? ""}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Enter image URL"
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

      case "image":
        return value ? (
          <Box>
            <Typography sx={{ mb: 1 }}>{value}</Typography>
            <img
              src={value as string}
              alt="Preview"
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 4,
              }}
            />
          </Box>
        ) : (
          "—"
        );

      default:
        return value;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        p: 1,
        backgroundColor:
          rowIndex % 2 === 0 ? "transparent" : "rgba(128, 0, 32, 0.03)",
        borderRadius: 1,
        width: "100%",
        minHeight: 32,
      }}
    >
      <Typography
        sx={{
          width: 120,
          flexShrink: 0,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "text.secondary",
          textAlign: "left",
          pt: 0.5,
        }}
      >
        {label}
      </Typography>

      {isEditing ? (
        <Box sx={{ flex: 1, pl: 2 }}>{renderEditControl()}</Box>
      ) : (
        <Typography
          component="div" // Changed from 'p' to 'div'
          sx={{
            flex: 1,
            fontSize: "0.875rem",
            pl: 2,
            m: 0,
            textAlign: "left",
            whiteSpace: "normal",
            wordBreak: "break-word",
            fontFamily: type === "json" ? "monospace" : "inherit",
          }}
        >
          {renderViewValue() || "—"}
        </Typography>
      )}
    </Box>
  );
};

export default PropertyRow;
