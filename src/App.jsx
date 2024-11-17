import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Use HashRouter
import Homepage from "./pages/Homepage";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
