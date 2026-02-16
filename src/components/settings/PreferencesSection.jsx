import React from 'react';
import { SectionHeader, ToggleRow } from './ShareUI';

export default function PreferencesSection({ preferences, onChange, onSave }) {
  return (
    <div className="settings-panel">
      <SectionHeader title="Preferences" desc="Customize your app experience." />

      <div className="settings-group">
        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-title">Theme</div>
            <div className="settings-row-desc">Choose light or dark theme.</div>
          </div>
          <select value={preferences.theme} onChange={(e) => onChange("theme", e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="settings-row">
          <div className="settings-row-left">
            <div className="settings-row-title">Language</div>
            <div className="settings-row-desc">Select your preferred language.</div>
          </div>
          <select value={preferences.language} onChange={(e) => onChange("language", e.target.value)}>
            <option value="en">English</option>
            <option value="fil">Filipino</option>
            <option value="ja">Japanese</option>
          </select>
        </div>

        <ToggleRow
          label="Compact Mode"
          desc="Reduce spacing for dense layout."
          checked={preferences.compactMode}
          onChange={(val) => onChange("compactMode", val)}
        />

        <ToggleRow
          label="Sound Effects"
          desc="Enable interface sounds."
          checked={preferences.soundEffects}
          onChange={(val) => onChange("soundEffects", val)}
        />
      </div>

      <div className="footer-actions">
        <button className="btn primary" onClick={onSave}>Save Preferences</button>
      </div>
    </div>
  );
}