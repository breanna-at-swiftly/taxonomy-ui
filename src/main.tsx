import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Authorization from "./Authorization";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authorization>
      <App />
    </Authorization>
  </StrictMode>
);
