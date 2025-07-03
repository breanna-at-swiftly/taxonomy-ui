import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            textAlign: "center",
          }}
        >
          <ErrorOutlineIcon color="error" sx={{ fontSize: 48 }} />
          <Typography variant="h6" color="error">
            Something went wrong in this component
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {this.state.error?.message}
          </Typography>
          <Button variant="contained" onClick={this.handleReset}>
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
