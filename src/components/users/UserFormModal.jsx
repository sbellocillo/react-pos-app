import React from 'react';

const UserFormModal = ({ 
  show, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData, 
  roles, 
  locations, 
  isEditing 
}) => {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">
          {isEditing ? 'Edit User' : 'Create New User'}
        </h3>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Username (Email) *</label>
            <input
              className="form-input"
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              maxLength="255"
              placeholder="user@ribshack.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing} // Only required on creation
              minLength="6"
              placeholder={isEditing ? "Leave blank to keep current" : "Min. 6 characters"}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Employee Number *</label>
            <input
              className="form-input"
              type="text"
              name="employee_num"
              value={formData.employee_num}
              onChange={handleChange}
              required
              maxLength="6"
              placeholder="000000"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              className="form-select"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Location *</label>
            <select
              className="form-select"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>{location.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active User
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="global-btn global-btn-submit">
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;