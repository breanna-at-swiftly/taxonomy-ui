import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { StubAuthProvider } from "./StubAuthProvider.tsx"; // Import the stub provider
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StubAuthProvider>
      {" "}
      {/* Use the stub provider here */}
      <App />
    </StubAuthProvider>
  </StrictMode>
);
