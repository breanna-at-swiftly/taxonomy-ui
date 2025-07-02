import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { GraphProvider } from "./context/GraphContext";
import { theme } from "./theme/theme";
import Layout from "./components/Layout";
import TaxonomyList from "./components/TaxonomyList";
import GraphEditor from "./components/GraphEditor";
import { VERSION } from "./config/version";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GraphProvider>
          <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-3 px-4">
                <h1 className="text-xl font-bold text-gray-900">
                  Swiftly Taxonomy Manager v{VERSION.number} {VERSION.label}
                </h1>
              </div>
            </header>
            <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<TaxonomyList />} />
                  <Route path="/editor" element={<GraphEditor />} />
                </Route>
              </Routes>
            </main>
          </div>
        </GraphProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
