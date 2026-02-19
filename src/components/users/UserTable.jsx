import React from 'react';

const UserTable = ({ users, onEdit, onDelete }) => {
  const getRoleColor = (roleName) => {
    if (!roleName) return { bg: '#f3f4f6', text: '#374151' };
    
    const colors = {
      'administrator': { bg: '#fef3c7', text: '#92400e' },
      'manager': { bg: '#dbeafe', text: '#1e40af' },
      'cashier': { bg: '#dcfce7', text: '#166534' },
      'cook': { bg: '#fde68a', text: '#b45309' },
      'server': { bg: '#e0e7ff', text: '#3730a3' }
    };

    return colors[roleName.toLowerCase()] || { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const roleColor = getRoleColor(user.role_name);
                return (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      <span 
                        className="role-badge"
                        style={{ backgroundColor: roleColor.bg, color: roleColor.text }}
                      >
                        {user.role_name}
                      </span>
                    </td>
                    <td>{user.location_name}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="global-btn-sm global-btn-edit" onClick={() => onEdit(user)}>
                          Edit
                        </button>
                        <button className="global-btn-sm global-btn-delete" onClick={() => onDelete(user.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;