// src/components/ChatBox.js
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatBox.css";

export default function ChatBox({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chatbox">
      {messages.map((msg) => (
        <div key={msg.id} className={`msg-row ${msg.role}`}>
          <div className="msg-avatar">
            {msg.role === "assistant" ? "✦" : "you"}
          </div>
          <div className={`msg-bubble ${msg.isError ? "error" : ""}`}>
            {msg.role === "assistant" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            ) : (
              <p>{msg.text}</p>
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="msg-row assistant">
          <div className="msg-avatar">✦</div>
          <div className="msg-bubble typing">
            <span /><span /><span />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}