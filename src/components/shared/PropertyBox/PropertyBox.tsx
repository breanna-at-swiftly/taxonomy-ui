import { Paper, Typography, Box } from "@mui/material";
import { propertyBoxStyles } from "../../../styles/propertyStyles";
import PropertyRow from "./PropertyRow";
import type { PropertyBoxProps } from "./types";

export const PropertyBox: React.FC<PropertyBoxProps> = ({
  title,
  properties,
}) => {
  return (
    <Paper elevation={1} sx={propertyBoxStyles.container}>
      <Typography variant="h6" sx={propertyBoxStyles.header}>
        {title}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {properties.map((prop, index) => (
          <PropertyRow key={`${prop.label}-${index}`} {...prop} index={index} />
        ))}
      </Box>
    </Paper>
  );
};
