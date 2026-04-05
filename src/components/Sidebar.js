// src/components/Sidebar.js
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV = [
  { to: "/",        icon: "◈", label: "Chat"    },
  { to: "/history", icon: "◷", label: "History" },
  { to: "/saved",   icon: "◆", label: "Saved"   },
  { to: "/quiz",    icon: "◉", label: "Quiz"    },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">✦</span>
        <span className="logo-text">StudyAI</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{n.icon}</span>
            <span className="nav-label">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-tag">BETA</span>
        <p className="sidebar-hint">Powered by AI</p>
      </div>
    </aside>
  );
}