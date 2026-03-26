import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

// overrides/ธีมของเรา (ถ้ามี)
import "./styles.css";

// ✅ import CartProvider
import { CartProvider } from "./context/CartContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>{/* ✅ ครอบ App ด้วย CartProvider */}
      <HashRouter>
        
        <App />
     
      </HashRouter>
    </CartProvider>
  </React.StrictMode>
);
