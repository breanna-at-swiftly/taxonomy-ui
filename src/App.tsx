import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import TaxonomyList from "./components/TaxonomyList";
import { VERSION } from "./config/version";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-3 px-4">
            <h1 className="text-xl font-bold text-gray-900">
              Swiftly Taxonomy Manager v{VERSION.number} {VERSION.label}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
          <TaxonomyList />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
