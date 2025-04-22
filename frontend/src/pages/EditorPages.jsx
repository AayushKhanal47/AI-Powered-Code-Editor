
"use client";

import { useState, useEffect} from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import axios from "axios";
import rehypeHighlight from "rehype-highlight";

const EditorPage = () => {
  const [code, setCode] = useState(`function sum() { return 1 + 1; }`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

  async function reviewCode() {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5001/api/ai/review", {
        params: {
          code: code,
        },
      });
      setReview(response.data.review || "No review received.");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Failed to get review. Please try again later.");
    }
    setLoading(false);
  }

  function clearCode() {
    setCode("");
    setReview("");
    setError("");
    setEditorKey((prevKey) => prevKey + 1);
  }

  const handleCodeChange = (newCode) => {
    setCode(newCode);
  };

  return (
    <div className="editor-container max-w-7xl mx-auto p-6 text-white">
      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-2 bg-gray-800 border-b border-gray-700 text-gray-300 text-sm">
          JavaScript
        </div>
        <Editor
          key={editorKey}
          value={code}
          onValueChange={handleCodeChange}
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
};

export default EditorPage;