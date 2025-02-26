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
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
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
        <div className="container">
          <div className="editor-section">
            <div className="section-header">
              <h2>Your Code</h2>
              <div className="language-badge">JavaScript</div>
            </div>
            <div className="editor-container">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
                padding={16}
                className="code-editor"
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: "14px",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="button-container">
              <button 
                onClick={reviewCode} 
                className={`review-button ${loading ? 'loading' : ''}`} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  <>Review Code</>
                )}
              </button>
              <button onClick={clearCode} className="clear-button">
                Clear
              </button>
            </div>
          </div>
          
          <div className="response-section">
            <div className="section-header">
              <h2>AI Review</h2>
              {review && <div className="status-badge success">Review Complete</div>}
            </div>
            <div className="response-container">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
              {!review && !error && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <p>Submit your code to get an AI-powered review</p>
                </div>
              )}
              {review && (
                <div className="review-content">
                  <Markdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        return !inline ? (
                          <SyntaxHighlighter style={dracula} language="javascript" {...props}>
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
              )}
            </div>
          </div>
        </div>
      </main>
      <footer>
        <p>AI Code Reviewer © 2025 | Powered by React</p>
      </footer>
    </div>
  );
}

export default App;