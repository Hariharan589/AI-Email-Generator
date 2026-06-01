import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReply = async () => {
    if (!emailContent.trim()) {
      alert("Please enter email content");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        {
          emailContent,
          tone,
        }
      );

      setGeneratedReply(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate email reply");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReply);
    alert("Copied Successfully!");
  };

  return (
    <div className="app">
      <div className="container">

        <h1>Email Reply Generator</h1>
        <p className="subtitle">
          Generate AI-powered email responses with custom tones
        </p>

        <div className="card">

          <label>Email Content</label>

          <textarea
            placeholder="Paste the original email here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />

          <label>Select Tone</label>

          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="tone-select"
          >
            <option value="Professional">Professional</option>
            <option value="Friendly">Friendly</option>
            <option value="Formal">Formal</option>
            <option value="Casual">Casual</option>
            <option value="Apologetic">Apologetic</option>
            <option value="Persuasive">Persuasive</option>
            <option value="Confident">Confident</option>
          </select>

          <button
            className="generate-btn"
            onClick={generateReply}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Reply"}
          </button>

        </div>

        {generatedReply && (
          <div className="card">

            <div className="reply-header">
              <h2>Generated Reply</h2>

              <button
                className="copy-btn"
                onClick={copyToClipboard}
              >
                Copy
              </button>
            </div>

            <textarea
              value={generatedReply}
              readOnly
              className="reply-box"
            />

          </div>
        )}

      </div>
    </div>
  );
}

export default App;