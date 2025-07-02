import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import { GraphProvider } from "./context/GraphContext";
import Layout from "./components/Layout";
import TaxonomyList from "./components/TaxonomyList";
import GraphEditor from "./components/GraphEditor";
import { Box } from "@mui/material";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ margin: 0, padding: 0 }}>
        <BrowserRouter>
          <GraphProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<TaxonomyList />} />
                <Route path="editor" element={<GraphEditor />} />
              </Route>
            </Routes>
          </GraphProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
