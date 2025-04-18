import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
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
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
      });
      setReview(response.data.review || "No review received.");
    } catch (error) {
      setError("Failed to get review. Please try again later.");
      console.error("API Error:", error);
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

  return (
    <div className={`app-container ${theme}`}>
      <header>
        <div className="header-content">
          <h1>
            <span className="logo-icon">⟨⟩</span> AI Code Reviewer
          </h1>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>
      <main>
        <div className="editor-container">
          <Editor
            value={code}
            onValueChange={(code) => setCode(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.javascript, "javascript")
            }
            padding={10}
            className="code-editor"
          />
          <div className="button-container">
            <button
              onClick={reviewCode}
              className="review-button"
              disabled={loading}
            >
              {loading ? "Reviewing..." : "Review Code"}
            </button>
            <button onClick={clearCode} className="clear-button">
              Clear
            </button>
          </div>
        </div>
        <div className="response-container">
          <h2>AI Review</h2>
          {error && <p className="error-message">{error}</p>}
          <Markdown
            rehypePlugins={[rehypeHighlight]}
            components={{
              code({ node, inline, className, children, ...props }) {
                return !inline ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language="javascript"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {review}
          </Markdown>
        </div>
      </main>
      <footer>
        <p>AI Code Reviewer © 2025 | Powered by React</p>
      </footer>
    </div>
  );
}

export default App;
