import React, { useState } from "react";

export function TextInput({ placeholder, inputRef, defaultValue, type, style, className }) {
  return (
    <input
      ref={inputRef}
      type={type || "text"}
      defaultValue={defaultValue || ""}
      placeholder={placeholder}
      className={`form-input ${className || ""}`}
      style={style}
    />
  );
}

export function TextArea({ placeholder, inputRef, defaultValue, rows, className }) {
  return (
    <textarea
      ref={inputRef}
      defaultValue={defaultValue || ""}
      placeholder={placeholder}
      rows={rows || 4}
      className={`form-input form-textarea ${className || ""}`}
    />
  );
}

export function Chip({ label, icon, desc, active, onClick, wide, mode }) {
  const modeClass = active ? `chip-active mode-${mode || "slot"}` : "";
  return (
    <div className="chip-tooltip-wrap">
      <button
        onClick={onClick}
        className={`chip ${modeClass} ${wide ? "chip-wide" : ""}`}
      >
        <span>
          {icon && <span className="chip-icon">{icon}</span>}
          {active && <span className="chip-check">✓ </span>}
          {label}
        </span>
        {wide && desc && <span className="chip-desc">{desc}</span>}
      </button>
      {!wide && desc && (
        <div className="chip-tooltip">{desc}</div>
      )}
    </div>
  );
}

export function Section({ color, title, sub, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section-card">
      <div className="section-header" onClick={() => setOpen(!open)}>
        <div className="section-indicator" style={{ background: color }} />
        <span className="section-title">{title}</span>
        <span className={`section-toggle ${open ? "open" : ""}`}>▼</span>
      </div>
      {sub && <div className="section-sub">{sub}</div>}
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}

export function Label({ children }) {
  return <label className="form-label">{children}</label>;
}

export function TabBar({ tabs, activeId, onChange }) {
  return (
    <div className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-item ${activeId === tab.id ? `tab-active mode-${tab.id}` : ""}`}
          onClick={() => onChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
