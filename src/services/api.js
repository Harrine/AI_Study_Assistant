// src/services/api.js
// ─────────────────────────────────────────────
// Central place for all API calls.
// Replace BASE_URL with your Azure API URL.
// ─────────────────────────────────────────────

const BASE_URL = process.env.REACT_APP_API_URL || "https://your-api.azurewebsites.net";

// Helper
const request = async (method, endpoint, body = null) => {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${endpoint}`, options);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }

  // Some DELETE endpoints return no body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ── Question / Chat ──────────────────────────
export const askQuestion = (questionText, userId = null) =>
  request("POST", "/Ask", { questionText, userId });

// ── History ──────────────────────────────────
export const getHistory = (userId = null) =>
  request("GET", `/api/question/history${userId ? `?userId=${userId}` : ""}`);

export const deleteHistoryItem = (id) =>
  request("DELETE", `/api/question/${id}`);

export const clearHistory = (userId = null) =>
  request("DELETE", `/api/question/clear${userId ? `?userId=${userId}` : ""}`);

// ── Saved Answers ─────────────────────────────
export const getSaved = (userId = null) =>
  request("GET", `/api/question/saved${userId ? `?userId=${userId}` : ""}`);

export const saveAnswer = (answerId) =>
  request("POST", `/api/question/save/${answerId}`);

export const unsaveAnswer = (answerId) =>
  request("DELETE", `/api/question/save/${answerId}`);

// ── Quiz ──────────────────────────────────────
export const generateQuiz = (topic, count = 5) =>
  request("POST", "/api/quiz/generate", { topic, count });