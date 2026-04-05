// src/pages/Home.js
import ChatBox from "../components/ChatBox";
import QuestionInput from "../components/QuestionInput";
import { useChat } from "../hooks/usechat";
import "./Home.css";

export default function Home() {
  const { messages, loading, sendMessage, clearChat } = useChat();

  return (
    <div className="home-page">
      <div className="home-header">
        <span className="tag">AI STUDY ASSISTANT</span>
        <h1 className="home-title">Ask anything,<br /><em>learn everything.</em></h1>
        <p className="home-sub">
          Powered by AI · Understands any subject · Answers in seconds
        </p>
      </div>

      <div className="chat-window">
        <ChatBox messages={messages} loading={loading} />
        <QuestionInput onSend={sendMessage} loading={loading} onClear={clearChat} />
      </div>
    </div>
  );
}