import React from 'react';
import { SectionHeader, ActionRow } from './ShareUI';

export default function AccountSection({ onReset, onLogout, onDelete, onSave }) {
  return (
    <div className="settings-panel">
      <SectionHeader title="Account" desc="Manage account actions." />

      <div className="settings-group">
        <ActionRow
          label="Reset All Settings"
          desc="Restore all settings to default values."
          buttonText="Reset"
          variant="ghost"
          onClick={onReset}
        />
        <ActionRow
          label="Logout"
          desc="Sign out from your account."
          buttonText="Logout"
          variant="warning"
          onClick={onLogout}
        />
        <ActionRow
          label="Delete Account"
          desc="Permanently delete your account and data."
          buttonText="Delete"
          variant="danger"
          onClick={onDelete}
        />
      </div>

      <div className="footer-actions">
        <button className="btn primary" onClick={onSave}>Save All Settings</button>
      </div>
    </div>
  );
}