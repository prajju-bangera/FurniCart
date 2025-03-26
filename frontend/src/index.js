import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { CartProvider } from "./components/CartContext"; // ✅ Ensure correct path


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
