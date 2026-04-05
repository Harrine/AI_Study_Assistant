// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import History from "./pages/History";
import Saved from "./pages/Saved";
import Quiz from "./pages/Quiz";
import "./styles/main.css";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/saved"   element={<Saved />} />
            <Route path="/quiz"    element={<Quiz />} />
          </Routes>
        </main>
      </div>

      <footer className="pf-footer">
        Powered by <span className="pf-footer-brand">Harrine.Dev</span>
      </footer>
    </BrowserRouter>
  );
}