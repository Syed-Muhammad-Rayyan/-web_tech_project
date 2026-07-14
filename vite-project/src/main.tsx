import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { MockStateProvider } from "./mockState.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <MockStateProvider>
        <App />
      </MockStateProvider>
    </BrowserRouter>
  </StrictMode>,
);

