import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import "./index.css";
import App from "./App";
// 1) import the CSS
import 'react-toastify/dist/ReactToastify.css';


// 2) import components
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  </StrictMode>
);
