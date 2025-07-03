import "./App.css";
import "./styles/split-pane.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import { GraphProvider } from "./context/GraphContext";
import { GraphSelectionProvider } from "./context/GraphSelectionContext";
import Layout from "./components/Layout";
import TaxonomyList from "./components/TaxonomyList";
import GraphEditor from "./components/GraphEditor";
import GraphList from "./components/GraphList";
import { Box } from "@mui/material";

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ margin: 0, padding: 0 }}>
        <BrowserRouter>
          <GraphProvider>
            <GraphSelectionProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<TaxonomyList />} />
                  <Route path="editor" element={<GraphEditor />} />
                  <Route path="graphs" element={<GraphList />} />
                  {/* ...other routes... */}
                </Route>
              </Routes>
            </GraphSelectionProvider>
          </GraphProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
};

export default App;
