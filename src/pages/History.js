// src/pages/History.js
import { useState, useEffect } from "react";
import { getHistory, deleteHistoryItem } from "../services/api";
import "./History.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      // Support both array and { results: [] } shapes
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      setError("Could not load history. Make sure the API is connected.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="page-content anim-up">
      <div className="page-header">
        <span className="tag">HISTORY</span>
        <h1 className="page-title">Past Questions</h1>
        <p className="page-sub">All your previous questions and AI answers.</p>
      </div>

      {loading && (
        <div className="state-msg">
          <div className="spinner" style={{ borderTopColor: "var(--accent)", borderColor: "rgba(200,245,71,0.2)" }} />
          <span>Loading history...</span>
        </div>
      )}

      {error && <div className="state-msg error">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="state-msg">No history yet. Start asking questions!</div>
      )}

      <div className="history-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={`history-card ${expanded === item.id ? "open" : ""}`}
          >
            <div className="history-card-header" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
              <div className="history-q">
                <span className="history-icon">?</span>
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
                <button className="btn-ghost delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}