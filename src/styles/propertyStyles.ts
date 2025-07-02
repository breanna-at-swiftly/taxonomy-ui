import type { SxProps, Theme } from "@mui/system";

export const propertyBoxStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    p: 2,
    height: "100%",
    overflow: "auto",
  } as SxProps<Theme>,

  header: {
    fontSize: "1.1rem",
    fontWeight: 500,
    mb: 2,
  } as SxProps<Theme>,

  propertyRow: {
    display: "flex",
    alignItems: "flex-start",
    minHeight: 32,
  } as SxProps<Theme>,

  propertyLabel: {
    width: 120,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "text.secondary",
    paddingRight: 2,
  } as SxProps<Theme>,

  propertyValue: {
    flex: 1,
    fontSize: "0.875rem",
    paddingLeft: 2,
    fontFamily: "inherit",
  } as SxProps<Theme>,

  preformattedValue: {
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    margin: 0,
    padding: 0,
  } as SxProps<Theme>,
} as const;
