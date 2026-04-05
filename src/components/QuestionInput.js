// src/components/QuestionInput.js
import { useState, useRef } from "react";
import "./QuestionInput.css";

const SUGGESTIONS = [
  "Explain Newton's laws of motion",
  "What is recursion in programming?",
  "How does photosynthesis work?",
  "Explain the French Revolution",
];

export default function QuestionInput({ onSend, loading, onClear }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!text.trim() || loading) return;
    onSend(text.trim());
    setText("");
    textareaRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      {/* Suggestion chips — shown only when empty */}
      {!text && (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => setText(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="question-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={loading}
        />
        <div className="input-actions">
          <button className="btn-ghost icon-btn" onClick={onClear} title="Clear chat">
            ⟳
          </button>
          <button
            className="btn-primary send-btn"
            onClick={handleSend}
            disabled={loading || !text.trim()}
          >
            {loading ? <span className="spinner" /> : "Send ↑"}
          </button>
        </div>
      </div>
    </div>
  );
}