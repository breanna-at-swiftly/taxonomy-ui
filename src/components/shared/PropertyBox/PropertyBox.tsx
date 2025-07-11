import { Paper, Typography, Box } from "@mui/material";
import { propertyBoxStyles } from "../../../styles/propertyStyles";
import PropertyRow from "./PropertyRow";
import type { PropertyBoxProps } from "./types";

interface Property {
  label: string;
  value: string | number;
}

interface PropertyBoxProps {
  title: string;
  subtitle?: string;
  properties: Array<{ label: string; value: any }>;
  actions?: React.ReactNode; // Make sure this exists
}

export const PropertyBox: React.FC<PropertyBoxProps> = ({
  title,
  subtitle,
  properties,
  actions, // Add actions prop
}) => {
  return (
    <Paper elevation={1} sx={propertyBoxStyles.container}>
      {/* Header section with title and actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={propertyBoxStyles.header}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="subtitle2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box>{actions}</Box>}
      </Box>

      {/* Properties list */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {properties.map((prop, index) => (
          <PropertyRow key={`${prop.label}-${index}`} {...prop} index={index} />
        ))}
      </Box>
    </Paper>
  );
};
