import React from 'react';
import { SectionHeader, ToggleRow } from './ShareUI';

export default function PrivacySection({ privacy, onChange, onSave }) {
  return (
    <div className="settings-panel">
      <SectionHeader
        title="Privacy & Security"
        desc="Manage privacy controls and security features."
      />

      <div className="settings-group">
        <ToggleRow
          label="Private Profile"
          desc="Only approved users can view your profile."
          checked={privacy.privateProfile}
          onChange={(val) => onChange("privateProfile", val)}
        />

        <ToggleRow
          label="Activity Status"
          desc="Show when you're active."
          checked={privacy.activityStatus}
          onChange={(val) => onChange("activityStatus", val)}
        />

        <ToggleRow
          label="Two-Factor Authentication"
          desc="Add extra security to your account."
          checked={privacy.twoFactorAuth}
          onChange={(val) => onChange("twoFactorAuth", val)}
        />
      </div>

      <div className="footer-actions">
        <button className="btn primary" onClick={onSave}>
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
}