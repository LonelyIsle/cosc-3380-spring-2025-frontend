import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext.jsx";
import { EmployeeProvider } from "./context/EmployeeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ShopProvider>
        <EmployeeProvider>
          <App />
        </EmployeeProvider>
      </ShopProvider>
    </BrowserRouter>
  </StrictMode>,
);
