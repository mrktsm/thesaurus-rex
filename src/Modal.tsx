import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "./components/Modal"; // Import your Modal component

// Render the Modal component in the #root div
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Modal />
  </React.StrictMode>
);
