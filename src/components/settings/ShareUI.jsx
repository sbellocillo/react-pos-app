import React from 'react';

export const SectionHeader = ({ title, desc }) => (
  <div style={{ marginBottom: 12 }}>
    <h4 style={{ marginTop: 12 }}>{title}</h4>
    {desc && <p style={{ margin: "6px 0 0", opacity: 0.75 }}>{desc}</p>}
  </div>
);

export const ToggleRow = ({ label, desc, checked, onChange }) => (
  <div className="settings-row">
    <div className="settings-row-left">
      <div className="settings-row-title">{label}</div>
      {desc && <div className="settings-row-desc">{desc}</div>}
    </div>
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider" />
    </label>
  </div>
);

export const ActionRow = ({ label, desc, buttonText, variant, onClick }) => (
  <div className="settings-row">
    <div className="settings-row-left">
      <div className="settings-row-title">{label}</div>
      {desc && <div className="settings-row-desc">{desc}</div>}
    </div>
    <button className={`btn ${variant || ""}`} onClick={onClick}>
      {buttonText}
    </button>
  </div>
);