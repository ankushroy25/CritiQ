import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { FlowProvider } from "./context/FlowProvider.jsx";
import { StateProvider } from "./context/StateProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <StateProvider>
        <FlowProvider>
          <App />
        </FlowProvider>
      </StateProvider>
    </BrowserRouter>
  </React.StrictMode>
);
