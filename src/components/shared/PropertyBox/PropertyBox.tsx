import { Paper, Typography, Box, IconButton, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { propertyBoxStyles } from "../../../styles/propertyStyles";
import PropertyRow from "./PropertyRow";
import type { PropertyBoxProps } from "./types";

export const PropertyBox: React.FC<PropertyBoxProps> = ({
  title,
  properties,
  isEditable,
  onPropertyChange,
  onSave,
  onSaveError,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperties, setEditedProperties] = useState(properties);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditToggle = () => {
    setIsEditing(true);
    setEditedProperties(properties); // Reset to original values
  };

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true);
      setError(null);
      try {
        await onSave(editedProperties);
        setIsEditing(false);
      } catch (error) {
        // Keep editing mode active on error
        const errorMessage =
          error instanceof Error ? error.message : "Save failed";
        setError(errorMessage);
        onSaveError?.(error as Error);
        // Don't reset editedProperties on error - allow user to try again
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperties(properties); // Reset to original values
  };

  return (
    <Paper elevation={1} sx={propertyBoxStyles.container}>
      {/* Header */}
      <Typography variant="h6" sx={propertyBoxStyles.header}>
        {title}
      </Typography>

      {/* Toolbar - only shown when isEditable is true */}
      {isEditable && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              gap: 1,
            }}
          >
            <Typography color="error" variant="caption">
              {error}
            </Typography>
            <Box display="flex" gap={1}>
              {isEditing ? (
                <>
                  <IconButton
                    size="small"
                    onClick={handleSave}
                    color="primary"
                    disabled={isSaving}
                    title="Save changes"
                  >
                    <SaveIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={handleCancel}
                    color="default"
                    disabled={isSaving}
                    title="Cancel editing"
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  size="small"
                  onClick={handleEditToggle}
                  color="default"
                  title="Edit properties"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Properties */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {properties.map((prop, index) => (
          <PropertyRow
            key={`${prop.label}-${index}`}
            {...prop}
            rowIndex={index}
            isEditing={isEditing && prop.editable}
            onChange={onPropertyChange}
          />
        ))}
      </Box>
    </Paper>
  );
};
