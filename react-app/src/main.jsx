import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { CourseProvider } from "./context/CourseContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   <HashRouter>
  <AuthProvider>
    <CourseProvider>
      <App />
    </CourseProvider>
  </AuthProvider>
</HashRouter>
  </React.StrictMode>
);
