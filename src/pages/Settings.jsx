import React, { useMemo, useRef, useState } from "react";
import "./styles/settings.css";

const Settings = () => {
  const [profile, setProfile] = useState({
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "+63 912 345 6789",
    bio: "Hello! I’m using this app.",
    avatarUrl: "",
  });

  const [tempAvatar, setTempAvatar] = useState("");
  const avatarInputRef = useRef(null);

  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    compactMode: false,
    soundEffects: true,
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    productNews: false,
    smsAlerts: false,
    pushNotifications: true,
  });

  const [privacy, setPrivacy] = useState({
    privateProfile: false,
    activityStatus: true,
    twoFactorAuth: false,
  });

  const categories = useMemo(
    () => [
      { id: "profile", label: "Profile" },
      { id: "preferences", label: "Preferences" },
      { id: "notifications", label: "Notifications" },
      { id: "privacy", label: "Privacy & Security" },
      { id: "account", label: "Account" },
    ],
    []
  );

  const [activeCategory, setActiveCategory] = useState("profile");

  const handleCategoryClick = (id) => setActiveCategory(id);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePreferencesChange = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotificationsChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveAll = () => {
    const payload = {
      profile,
      preferences,
      notifications,
      privacy,
    };

    console.log("✅ SAVING SETTINGS:", payload);
    alert("Settings saved successfully!");
  };

  const handleResetAll = () => {
    const ok = window.confirm("Reset all settings to defaults?");
    if (!ok) return;

    setProfile({
      fullName: "",
      email: "",
      phone: "",
      bio: "",
      avatarUrl: "",
    });

    setPreferences({
      theme: "light",
      language: "en",
      compactMode: false,
      soundEffects: true,
    });

    setNotifications({
      emailUpdates: true,
      productNews: false,
      smsAlerts: false,
      pushNotifications: true,
    });

    setPrivacy({
      privateProfile: false,
      activityStatus: true,
      twoFactorAuth: false,
    });

    setTempAvatar("");
    alert("Settings reset to defaults.");
  };

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    console.log("🚪 LOGGING OUT...");
    alert("Logged out!");
  };

  const handleDeleteAccount = () => {
    const ok = window.confirm(
      "This will permanently delete your account. Continue?"
    );
    if (!ok) return;

    console.log("🗑️ DELETING ACCOUNT...");
    alert("Account deleted!");
  };

  const handleAvatarPick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setTempAvatar(previewUrl);

    setProfile((prev) => ({ ...prev, avatarUrl: previewUrl }));
  };

  const SectionHeader = ({ title, desc }) => (
    <div style={{ marginBottom: 12 }}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      {desc ? <p style={{ margin: "6px 0 0", opacity: 0.75 }}>{desc}</p> : null}
    </div>
  );

  const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div className="settings-row">
      <div className="settings-row-left">
        <div className="settings-row-title">{label}</div>
        {desc ? <div className="settings-row-desc">{desc}</div> : null}
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

  const ActionRow = ({ label, desc, buttonText, variant, onClick }) => (
    <div className="settings-row">
      <div className="settings-row-left">
        <div className="settings-row-title">{label}</div>
        {desc ? <div className="settings-row-desc">{desc}</div> : null}
      </div>
      <button className={`btn ${variant || ""}`} onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeCategory) {
      case "profile":
        return (
          <div className="settings-panel">
            <SectionHeader
              title="Profile Update"
              desc="Update your personal information and avatar."
            />

            <div className="profile-grid">
              <div className="profile-avatar">
                <div className="avatar-preview">
                  {tempAvatar || profile.avatarUrl ? (
                    <img
                      src={tempAvatar || profile.avatarUrl}
                      alt="avatar"
                      className="avatar-img"
                    />
                  ) : (
                    <div className="avatar-fallback">No Avatar</div>
                  )}
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />

                <button className="btn" onClick={handleAvatarPick}>
                  Upload Avatar
                </button>
              </div>

              <div className="profile-form">
                <div className="form-row">
                  <label>Full Name</label>
                  <input
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    placeholder="Enter full name"
                  />
                </div>

                <div className="form-row">
                  <label>Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-row">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-row">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    placeholder="Write something about you..."
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn primary" onClick={handleSaveAll}>
                    Save Profile
                  </button>
                  <button className="btn ghost" onClick={handleResetAll}>
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="settings-panel">
            <SectionHeader
              title="Preferences"
              desc="Customize your app experience."
            />

            <div className="settings-group">
              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-row-title">Theme</div>
                  <div className="settings-row-desc">
                    Choose light or dark theme.
                  </div>
                </div>
                <select
                  value={preferences.theme}
                  onChange={(e) =>
                    handlePreferencesChange("theme", e.target.value)
                  }
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              <div className="settings-row">
                <div className="settings-row-left">
                  <div className="settings-row-title">Language</div>
                  <div className="settings-row-desc">
                    Select your preferred language.
                  </div>
                </div>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    handlePreferencesChange("language", e.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="fil">Filipino</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>

              <ToggleRow
                label="Compact Mode"
                desc="Reduce spacing for dense layout."
                checked={preferences.compactMode}
                onChange={(val) => handlePreferencesChange("compactMode", val)}
              />

              <ToggleRow
                label="Sound Effects"
                desc="Enable interface sounds."
                checked={preferences.soundEffects}
                onChange={(val) => handlePreferencesChange("soundEffects", val)}
              />
            </div>

            <div className="footer-actions">
              <button className="btn primary" onClick={handleSaveAll}>
                Save Preferences
              </button>
            </div>
          </div>
        );

      case "notifications":
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
                onChange={(val) => handleNotificationsChange("emailUpdates", val)}
              />

              <ToggleRow
                label="Product News"
                desc="Get notified about new features."
                checked={notifications.productNews}
                onChange={(val) => handleNotificationsChange("productNews", val)}
              />

              <ToggleRow
                label="SMS Alerts"
                desc="Get alerts via SMS (if available)."
                checked={notifications.smsAlerts}
                onChange={(val) => handleNotificationsChange("smsAlerts", val)}
              />

              <ToggleRow
                label="Push Notifications"
                desc="Enable push alerts in your device."
                checked={notifications.pushNotifications}
                onChange={(val) =>
                  handleNotificationsChange("pushNotifications", val)
                }
              />
            </div>

            <div className="footer-actions">
              <button className="btn primary" onClick={handleSaveAll}>
                Save Notifications
              </button>
            </div>
          </div>
        );

      case "privacy":
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
                onChange={(val) => handlePrivacyChange("privateProfile", val)}
              />

              <ToggleRow
                label="Activity Status"
                desc="Show when you're active."
                checked={privacy.activityStatus}
                onChange={(val) => handlePrivacyChange("activityStatus", val)}
              />

              <ToggleRow
                label="Two-Factor Authentication"
                desc="Add extra security to your account."
                checked={privacy.twoFactorAuth}
                onChange={(val) => handlePrivacyChange("twoFactorAuth", val)}
              />
            </div>

            <div className="footer-actions">
              <button className="btn primary" onClick={handleSaveAll}>
                Save Privacy Settings
              </button>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="settings-panel">
            <SectionHeader title="Account" desc="Manage account actions." />

            <div className="settings-group">
              <ActionRow
                label="Reset All Settings"
                desc="Restore all settings to default values."
                buttonText="Reset"
                variant="ghost"
                onClick={handleResetAll}
              />

              <ActionRow
                label="Logout"
                desc="Sign out from your account."
                buttonText="Logout"
                variant="warning"
                onClick={handleLogout}
              />

              <ActionRow
                label="Delete Account"
                desc="Permanently delete your account and data."
                buttonText="Delete"
                variant="danger"
                onClick={handleDeleteAccount}
              />
            </div>

            <div className="footer-actions">
              <button className="btn primary" onClick={handleSaveAll}>
                Save All Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="main-layout-container">
      <header className="settings-header">
        <div className="settings-header-top">
          <h3 className="section-title">Settings</h3>

          <div className="settings-topbar-actions">
            <button className="btn ghost" onClick={handleResetAll} type="button">
              Reset All
            </button>
            <button className="btn primary" onClick={handleSaveAll} type="button">
              Save All
            </button>
          </div>
        </div>

        <nav className="settings-navbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`nav-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat.id)}
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
