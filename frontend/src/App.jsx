import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EditorPage from "./pages/EditorPages";

import "prismjs/themes/prism-tomorrow.css";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <Router>
      <div className={`app-container ${theme}`}>
        <header className="bg-gray-900 border-b border-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold flex items-center">
              <span className="text-purple-400 mr-2">⟨⟩</span> AI Code Reviewer
            </h1>
            <button
              onClick={toggleTheme}
              className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
          </div>
        </header>

        <main className="bg-gray-950 min-h-screen">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/editor" element={<EditorPage />} />
          </Routes>
        </main>

        <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-gray-400">
          <p>AI Code Reviewer © 2025</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
