import "./App.css";
import "./styles/split-pane.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import { GraphProvider } from "./context/GraphContext";
import Layout from "./components/Layout";
import GraphList from "./components/GraphList"; // Updated import
import GraphEditor from "./components/GraphEditor";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { useStubAuth } from "./StubAuthProvider"; // Import the stub hook
import { setupAuthInterceptor } from "./services/taxonomyService"; // Import the interceptor setup function

export const App = () => {
  // Use our stub hook instead of useAuth0
  const { isAuthenticated, getAccessTokenSilently } = useStubAuth();

  // This effect runs once and sets up the interceptor for all future API calls
  useEffect(() => {
    if (isAuthenticated) {
      setupAuthInterceptor(getAccessTokenSilently);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ margin: 0, padding: 0 }}>
        <BrowserRouter>
          <GraphProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<GraphList />} />
                <Route path="editor" element={<GraphEditor />} />
                {/* ...other routes... */}
              </Route>
            </Routes>
          </GraphProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
