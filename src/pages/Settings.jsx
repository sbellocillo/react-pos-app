import React, { useMemo, useRef, useState } from "react";
import "../styles/settings.css";

// Import your newly created components
import ProfileSection from "../components/settings/ProfileSection";
import PreferencesSection from "../components/settings/PreferencesSection";
import NotificationsSection from "../components/settings/NotificationSection";
import PrivacySection from "../components/settings/PrivacySection";
import AccountSection from "../components/settings/AccountSection";

const Settings = () => {
  // --- 1. STATE REMAINS HERE ---
  const [profile, setProfile] = useState({ /* ... initial state ... */ });
  const [tempAvatar, setTempAvatar] = useState("");
  const avatarInputRef = useRef(null);
  const [preferences, setPreferences] = useState({ /* ... initial state ... */ });
  const [notifications, setNotifications] = useState({ /* ... initial state ... */ });
  const [privacy, setPrivacy] = useState({ /* ... initial state ... */ });
  
  const [activeCategory, setActiveCategory] = useState("profile");

  const categories = useMemo(() => [
    { id: "profile", label: "Profile" },
    { id: "preferences", label: "Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "privacy", label: "Privacy & Security" },
    { id: "account", label: "Account" },
  ], []);

  // --- 2. HANDLERS REMAIN HERE ---
  const handleProfileChange = (e) => { /* ... */ };
  const handlePreferencesChange = (key, value) => { /* ... */ };
  const handleNotificationsChange = (key, value) => { /* ... */ };
  const handlePrivacyChange = (key, value) => { /* ... */ };
  const handleSaveAll = () => { /* ... */ };
  const handleResetAll = () => { /* ... */ };
  const handleLogout = () => { /* ... */ };
  const handleDeleteAccount = () => { /* ... */ };
  const handleAvatarPick = () => { /* ... */ };
  const handleAvatarChange = (e) => { /* ... */ };

  // --- 3. CLEAN RENDER MAP ---
  const renderActiveSection = () => {
    switch (activeCategory) {
      case "profile":
        return <ProfileSection 
                  profile={profile} 
                  tempAvatar={tempAvatar} 
                  avatarInputRef={avatarInputRef}
                  onChange={handleProfileChange} 
                  onAvatarPick={handleAvatarPick}
                  onAvatarChange={handleAvatarChange}
                  onSave={handleSaveAll} 
                  onReset={handleResetAll} 
                />;
      case "preferences":
        return <PreferencesSection preferences={preferences} onChange={handlePreferencesChange} onSave={handleSaveAll} />;
      case "notifications":
        return <NotificationsSection notifications={notifications} onChange={handleNotificationsChange} onSave={handleSaveAll} />;
      case "privacy":
        return <PrivacySection privacy={privacy} onChange={handlePrivacyChange} onSave={handleSaveAll} />;
      case "account":
        return <AccountSection onReset={handleResetAll} onLogout={handleLogout} onDelete={handleDeleteAccount} onSave={handleSaveAll} />;
      default:
        return null;
    }
  };

  return (
    /* Changed from main-layout-container to a dedicated wrapper */
    <div className="settings-page-wrapper"> 
      
      {/* Changed class from settings-container to settings-header */}
      <header className="settings-header">
        <div className="settings-header-top">
          <h3 className="section-title">Settings</h3>
          <div className="settings-topbar-actions">
            <button className="btn ghost" onClick={handleResetAll} type="button">Reset All</button>
            <button className="btn primary" onClick={handleSaveAll} type="button">Save All</button>
          </div>
        </div>

        <nav className="settings-navbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`nav-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="settings-layout">
        <main className="settings-content">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

export default Settings;