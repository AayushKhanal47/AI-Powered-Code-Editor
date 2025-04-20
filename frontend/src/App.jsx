"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    prism.highlightAll();
    document.body.className = theme;
  }, [theme]);

  async function reviewCode() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/ai/review", {
        code,
      });
      setReview(response.data.review || "No review received.");
    } catch (error) {
      setError("Failed to get review. Please try again later.");
    }
    setLoading(false);
  }

  function clearCode() {
    setCode("");
    setReview("");
    setError("");
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const EditorPage = () => (
    <div className="editor-container max-w-7xl mx-auto p-6 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-2 bg-gray-800 border-b border-gray-700 text-gray-300 text-sm">
          JavaScript
        </div>
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) =>
            prism.highlight(code, prism.languages.javascript, "javascript")
          }
          padding={16}
          className="code-editor font-mono text-gray-200"
          style={{
            backgroundColor: "#1a1a2e",
            fontFamily: '"Fira Code", "Fira Mono", monospace',
          }}
        />
      </div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={reviewCode}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            loading
              ? "bg-purple-800 text-gray-300 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
        <button
          onClick={clearCode}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium"
        >
          Clear
        </button>
      </div>
      {review && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-purple-400">AI Review:</h3>
          <div className="prose prose-invert max-w-none">
            <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-800 rounded-md text-white">
          {error}
        </div>
      )}
    </div>
  );

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
