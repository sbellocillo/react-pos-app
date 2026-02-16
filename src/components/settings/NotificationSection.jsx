import React from 'react';
import { SectionHeader, ToggleRow } from './ShareUI';

export default function NotificationsSection({ notifications, onChange, onSave }) {
  return (
    <div className="settings-panel">
      <SectionHeader
        title="Notifications"
        desc="Control which alerts you receive."
      />

      <div className="settings-group">
        <ToggleRow
          label="Email Updates"
          desc="Receive important updates in email."
          checked={notifications.emailUpdates}
          onChange={(val) => onChange("emailUpdates", val)}
        />

        <ToggleRow
          label="Product News"
          desc="Get notified about new features."
          checked={notifications.productNews}
          onChange={(val) => onChange("productNews", val)}
        />

        <ToggleRow
          label="SMS Alerts"
          desc="Get alerts via SMS (if available)."
          checked={notifications.smsAlerts}
          onChange={(val) => onChange("smsAlerts", val)}
        />

        <ToggleRow
          label="Push Notifications"
          desc="Enable push alerts in your device."
          checked={notifications.pushNotifications}
          onChange={(val) => onChange("pushNotifications", val)}
        />
      </div>

      <div className="footer-actions">
        <button className="btn primary" onClick={onSave}>
          Save Notifications
        </button>
      </div>
    </div>
  );
}