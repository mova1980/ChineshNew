import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Local font — fully offline, no CDN needed
import "@fontsource-variable/vazirmatn";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
