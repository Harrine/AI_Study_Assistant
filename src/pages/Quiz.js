// src/pages/Quiz.js
import { useState } from "react";
import { generateQuiz } from "../services/api";
import "./Quiz.css";

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [step, setStep] = useState("setup"); // setup | quiz | result
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateQuiz(topic, count);
      const qs = Array.isArray(data) ? data : data.questions || [];
      if (!qs.length) { setError("No questions returned. Try a different topic."); setLoading(false); return; }
      setQuestions(qs);
      setCurrent(0);
      setScore(0);
      setAnswers([]);
      setSelected(null);
      setStep("quiz");
    } catch {
      setError("Failed to generate quiz. Make sure the API is connected.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (ans) => {
    if (selected !== null) return;
    setSelected(ans);
  };

  const handleNext = () => {
    const q = questions[current];
    const isCorrect = selected === (q.correctAnswer || q.correct_answer);
    const updatedAnswers = [...answers, { ...q, userAnswer: selected, isCorrect }];
    setAnswers(updatedAnswers);
    if (isCorrect) setScore((s) => s + 1);
    setSelected(null);
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setStep("result");
  };

  const restart = () => {
    setStep("setup");
    setTopic("");
    setQuestions([]);
    setAnswers([]);
    setSelected(null);
    setScore(0);
    setCurrent(0);
  };

  const progress = questions.length > 0 ? (current / questions.length) * 100 : 0;

  return (
    <div className="page-content anim-up">

      {/* ── SETUP ── */}
      {step === "setup" && (
        <>
          <div className="page-header">
            <span className="tag">QUIZ</span>
            <h1 className="page-title">Test your<br /><em>knowledge.</em></h1>
            <p className="page-sub">Enter a topic and the AI will generate a quiz for you.</p>
          </div>

          <div className="quiz-setup-card">
            <label className="q-label">Topic</label>
            <input
              className="q-input"
              type="text"
              placeholder="e.g. World War II, Python basics, Human Biology..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && startQuiz()}
            />

            <label className="q-label">Number of Questions</label>
            <input
              className="q-input"
              type="number"
              min="3"
              max="15"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            />

            {error && <p className="q-error">{error}</p>}

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.25rem" }} onClick={startQuiz} disabled={loading || !topic.trim()}>
              {loading ? <><span className="spinner" /> Generating...</> : "Generate Quiz →"}
            </button>
          </div>
        </>
      )}

      {/* ── QUIZ ── */}
      {step === "quiz" && questions.length > 0 && (
        <div className="quiz-card">
          <div className="q-progress-bar">
            <div className="q-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="q-meta-row">
            <span className="tag">Q {current + 1} / {questions.length}</span>
            <span className="q-score-badge">Score: {score}</span>
          </div>

          <h2 className="q-question">{questions[current].questionText || questions[current].question}</h2>

          <div className="q-answers">
            {(questions[current].options || questions[current].answers || []).map((ans, i) => {
              let cls = "q-answer-btn";
              if (selected !== null) {
                const correct = questions[current].correctAnswer || questions[current].correct_answer;
                if (ans === correct) cls += " correct";
                else if (ans === selected) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => handleSelect(ans)}>{ans}</button>
              );
            })}
          </div>

          {selected !== null && (
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }} onClick={handleNext}>
              {current + 1 < questions.length ? "Next →" : "See Results →"}
            </button>
          )}
        </div>
      )}

      {/* ── RESULT ── */}
      {step === "result" && (
        <div className="quiz-card">
          <span className="tag">RESULTS</span>
          <div className="q-score-ring">
            <span className="q-score-num">{score}</span>
            <span className="q-score-denom">/ {questions.length}</span>
          </div>
          <p className="page-sub" style={{ marginBottom: "1.75rem" }}>
            {score === questions.length ? "Perfect! 🎉" : score >= questions.length / 2 ? "Great work! 💪" : "Keep studying! 📚"}
          </p>

          <div className="section-label">Review</div>
          <div className="q-review-list">
            {answers.map((item, i) => (
              <div key={i} className={`q-review-item ${item.isCorrect ? "correct" : "wrong"}`}>
                <span className="q-review-indicator">{item.isCorrect ? "✓" : "✗"}</span>
                <div>
                  <p className="q-review-question">{item.questionText || item.question}</p>
                  <p className="q-review-line">
                    <span className="q-review-label">Your answer: </span>
                    <span className={item.isCorrect ? "ans-correct" : "ans-wrong"}>{item.userAnswer}</span>
                  </p>
                  {!item.isCorrect && (
                    <p className="q-review-line">
                      <span className="q-review-label">Correct: </span>
                      <span className="ans-correct">{item.correctAnswer || item.correct_answer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }} onClick={restart}>
            New Quiz
          </button>
        </div>
      )}
    </div>
  );
}