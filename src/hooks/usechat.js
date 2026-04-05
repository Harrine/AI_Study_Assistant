// src/hooks/useChat.js
import { useState, useCallback } from "react";
import { askQuestion } from "../services/api";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "assistant",
      text: "Hi! I'm your AI Study Assistant. Ask me anything — concepts, problems, or topics you want to explore. 🎓",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const data = await askQuestion(text);
      const aiMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.answer || data.answerText || "Sorry, I couldn't get a response.",
        answerId: data.id || null,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError("Failed to get a response. Please try again.");
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", text: "⚠️ Something went wrong. Please try again.", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        text: "Chat cleared! Ask me a new question. 🎓",
      },
    ]);
    setError(null);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
}