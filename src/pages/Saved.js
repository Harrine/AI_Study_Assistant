// src/pages/Saved.js
import { useState, useEffect } from "react";
import { getSaved, unsaveAnswer } from "../services/api";
import "./History.css"; // reuse same styles

export default function Saved() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSaved();
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch {
      setError("Could not load saved answers. Make sure the API is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUnsave = async (id) => {
    try {
      await unsaveAnswer(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Failed to remove.");
    }
  };

  return (
    <div className="page-content anim-up">
      <div className="page-header">
        <span className="tag">SAVED</span>
        <h1 className="page-title">Saved Answers</h1>
        <p className="page-sub">Answers you bookmarked for quick access.</p>
      </div>

      {loading && (
        <div className="state-msg">
          <div className="spinner" style={{ borderTopColor: "var(--accent)", borderColor: "rgba(200,245,71,0.2)" }} />
          <span>Loading saved...</span>
        </div>
      )}

      {error && <div className="state-msg error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="state-msg">No saved answers yet. Save answers from the chat!</div>
      )}

      <div className="history-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`history-card ${expanded === item.id ? "open" : ""}`}
          >
            <div className="history-card-header" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div className="history-q">
                <span className="history-icon" style={{ color: "var(--accent2)", borderColor: "rgba(93,212,244,0.3)" }}>◆</span>
                <span className="history-qtext">{item.questionText || item.question}</span>
              </div>
              <div className="history-meta">
                <span className="history-date">
                  {item.createdDate ? new Date(item.createdDate).toLocaleDateString() : ""}
                </span>
                <span className="history-chevron">{expanded === item.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {expanded === item.id && (
              <div className="history-answer anim-in">
                <p className="answer-label">Answer</p>
                <p className="answer-text">{item.answerText || item.answer || "No answer stored."}</p>
                <button className="btn-ghost delete-btn" onClick={() => handleUnsave(item.id)}>
                  Remove from saved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}