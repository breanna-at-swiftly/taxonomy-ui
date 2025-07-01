import "./App.css";
import TaxonomyList from "./components/TaxonomyList";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-3 px-4">
          <h1 className="text-xl font-bold text-gray-900">
            Swiftly Taxonomy Manager v0.5 (POC)
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <TaxonomyList />
      </main>
    </div>
  );
}

export default App;
