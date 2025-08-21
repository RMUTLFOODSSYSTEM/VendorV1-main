import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Bootstrap CSS (ตามเอกสาร React-Bootstrap)
import "bootstrap/dist/css/bootstrap.min.css";

// overrides/ธีมของเรา (ถ้ามี)
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
