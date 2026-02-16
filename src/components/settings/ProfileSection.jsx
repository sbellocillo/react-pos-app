// components/settings/ProfileSection.jsx
import React from 'react';
import { SectionHeader } from './ShareUI';
//import { SectionHeader } from './SharedUI';

export default function ProfileSection({
  profile,
  tempAvatar,
  avatarInputRef,
  onChange,
  onAvatarPick,
  onAvatarChange,
  onSave,
  onReset
}) {
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
            onChange={onAvatarChange}
          />

          <button className="btn" onClick={onAvatarPick}>
            Upload Avatar
          </button>
        </div>

        <div className="profile-form">
          <div className="form-row">
            <label>Full Name</label>
            <input
              name="fullName"
              value={profile.fullName}
              onChange={onChange}
              placeholder="Enter full name"
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              value={profile.email}
              onChange={onChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              name="phone"
              value={profile.phone}
              onChange={onChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-row">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={onChange}
              placeholder="Write something about you..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button className="btn primary" onClick={onSave}>
              Save Profile
            </button>
            <button className="btn ghost" onClick={onReset}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}