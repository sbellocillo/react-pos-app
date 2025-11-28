import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role_id: '',
    role_name: '',
    location_id: '',
    location_name: '',
    is_active: true
  });

  // Sample roles for dropdown
  const sampleRoles = [
    { id: 1, name: 'Administrator' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Cashier' },
    { id: 4, name: 'Cook' },
    { id: 5, name: 'Server' }
  ];

  // Sample locations for dropdown
  const sampleLocations = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'BGC Branch' },
    { id: 3, name: 'Ortigas Branch' },
    { id: 4, name: 'Makati Branch' },
    { id: 5, name: 'Quezon City Branch' }
  ];

  // Sample users data
  const sampleUsers = [
    {
      id: 1,
      username: 'admin@ribshack.com',
      role_id: 1,
      role_name: 'Administrator',
      location_id: 1,
      location_name: 'Main Branch',
      is_active: true
    },
    {
      id: 2,
      username: 'manager.main@ribshack.com',
      role_id: 2,
      role_name: 'Manager',
      location_id: 1,
      location_name: 'Main Branch',
      is_active: true
    },
    {
      id: 3,
      username: 'cashier1@ribshack.com',
      role_id: 3,
      role_name: 'Cashier',
      location_id: 2,
      location_name: 'BGC Branch',
      is_active: true
    },
    {
      id: 4,
      username: 'cook.bgc@ribshack.com',
      role_id: 4,
      role_name: 'Cook',
      location_id: 2,
      location_name: 'BGC Branch',
      is_active: true
    },
    {
      id: 5,
      username: 'server.temp@ribshack.com',
      role_id: 5,
      role_name: 'Server',
      location_id: 3,
      location_name: 'Ortigas Branch',
      is_active: false
    }
  ];

  useEffect(() => {
    getAllRoles();
    getAllLocations();
    getAllUsers();

  }, []);

  let getAllRoles = async () => {
    try {
      let response = await apiEndpoints.roles.getAll();
      console.log("response", response);
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Fall back to sample data if API call fails
      setRoles(sampleRoles);
    }
  }

  let getAllLocations = async () => {
    try {
      let response = await apiEndpoints.locations.getAll();
      console.log("response", response);
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fall back to sample data if API call fails
      setLocations(sampleLocations);
    }
  }


  let getAllUsers = async () => {
    try {
      let response = await apiEndpoints.users.getAll();
      console.log("getAllUsers response", response.data.data);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fall back to sample data if API call fails
      setUsers(sampleUsers);
    }
  }

  let postNewUser = async (data) => {
    try {
      let response = await apiEndpoints.users.create(data);
      alert('User created successfully!', response);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  let updateUser = async (id, data) => {
    try {
      console.log("Updating user with data:", data);
      let response = await apiEndpoints.users.update(id, data);
      alert('User updated successfully!', response);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  let deleteUser = async (id) => {
    try {
      let response = await apiEndpoints.users.delete(id);
      alert('User deleted successfully!', response);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }


  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role_id: '',
      role_name: '',
      location_id: '',
      location_name: '',
      is_active: true
    });
  };

  const handleCreate = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim() || !formData.role_id || !formData.location_id) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      alert('Please enter a valid email address');
      return;
    }

    // Check for duplicate username
    const existingUser = users.find(u =>
      u.username.toLowerCase() === formData.username.toLowerCase() &&
      (!editingUser || u.id !== editingUser.id)
    );

    if (existingUser) {
      alert('A user with this username already exists');
      return;
    }

    const selectedRole = roles.find(r => r.id === parseInt(formData.role_id));
    const selectedLocation = locations.find(l => l.id === parseInt(formData.location_id));
    const userData = {
      ...formData,
      role_id: parseInt(formData.role_id),
      role_name: selectedRole.name,
      location_id: parseInt(formData.location_id),
      location_name: selectedLocation.name
    };

    if (editingUser) {
      setUsers(users.map(u =>
        u.id === editingUser.id
          ? { ...userData, id: editingUser.id }
          : u
      ));
      console.log("Updating user with data:", userData);
      updateUser(editingUser.id, userData);
    } else {
      const newUser = {
        ...userData,
        id: Math.max(...users.map(u => u.id), 0) + 1
      };
      console.log("creating user with data:", newUser);
      setUsers([...users, newUser]);
      postNewUser(newUser);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      deleteUser(id);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            padding: '0.5rem 0.75rem',
            margin: '0 0.25rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#374151'
          }}
        >
          ‹
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          style={{
            padding: '0.5rem 0.75rem',
            margin: '0 0.25rem',
            background: currentPage === i ? '#3b82f6' : 'white',
            color: currentPage === i ? 'white' : '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: currentPage === i ? '600' : '400'
          }}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            padding: '0.5rem 0.75rem',
            margin: '0 0.25rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#374151'
          }}
        >
          ›
        </button>
      );
    }

    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1.5rem',
        background: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length} users
          </span>
          <div style={{ display: 'flex' }}>
            {pages}
          </div>
        </div>
      </div>
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getRoleColor = (roleName) => {
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
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Users Management</h2>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Create User
        </button>
      </div>
      <div>Total Records:  {users.length}</div>
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '650px'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                width: '80px'
              }}>
                ID
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Username
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Role
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Location
              </th>

              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                width: '200px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const roleColor = getRoleColor(user.role_name);
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    #{user.id}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                    {user.username}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      background: roleColor.bg,
                      color: roleColor.text
                    }}>
                      {user.role_name}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>
                    {user.location_name}
                  </td>

                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {renderPagination()}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              {editingUser ? 'Edit User' : 'Create New User'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Username (Email) *
                </label>
                <input
                  type="email"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  maxLength="255"
                  placeholder="user@ribshack.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  placeholder="Enter password (min. 6 characters)"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Role *
                </label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Location *
                </label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">Select a location</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  Active
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500'
                  }}
                >
                  {editingUser ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;