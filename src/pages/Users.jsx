import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import UserTable from '../components/users/UserTable';
import UserFormModal from '../components/users/UserFormModal';
import Pagination from '../components/Pagination';
import '../styles/users.css';

const Users = () => {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const initialFormState = {
    username: '',
    password: '',
    role_id: '',
    role_name: '',
    location_id: '',
    location_name: '',
    is_active: true,
    employee_num: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  // --- API Calls ---
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    await Promise.all([getAllRoles(), getAllLocations(), getAllUsers()]);
  };

  const getAllRoles = async () => {
    try {
      let response = await apiEndpoints.roles.getAll();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const getAllLocations = async () => {
    try {
      let response = await apiEndpoints.locations.getAll();
      setLocations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      let response = await apiEndpoints.users.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // --- Handlers ---
  const handleCreate = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    // Ensure numeric values are handled correctly for select inputs
    setFormData({
        ...user,
        password: '' // Reset password field for security/UI reasons
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiEndpoints.users.delete(id);
        setUsers(users.filter(u => u.id !== id));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.username.trim() || !formData.role_id || !formData.location_id || !formData.employee_num) {
      alert('Please fill in all required fields');
      return;
    }

    if (!editingUser && (!formData.password || formData.password.length < 6)) {
      alert('Password must be at least 6 characters long');
      return;
    }

    // Prepare Payload
    const selectedRole = roles.find(r => r.id === parseInt(formData.role_id));
    const selectedLocation = locations.find(l => l.id === parseInt(formData.location_id));
    
    const payload = {
      ...formData,
      role_id: parseInt(formData.role_id),
      role_name: selectedRole?.name,
      location_id: parseInt(formData.location_id),
      location_name: selectedLocation?.name
    };

    try {
      if (editingUser) {
        await apiEndpoints.users.update(editingUser.id, payload);
        // Optimistic UI update or refetch
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload } : u));
        alert('User updated successfully!');
      } else {
        const response = await apiEndpoints.users.create(payload);
        // Assuming API returns the created object, otherwise refetch
        if (response.data) {
             setUsers([...users, response.data]);
        } else {
             getAllUsers(); // Refetch if API doesn't return the new object
        }
        alert('User created successfully!');
      }
      setShowModal(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Operation failed:', error);
      alert('Operation failed. Please check console.');
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, users.length);
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-row">
        <h2 className="page-title">Users Management</h2>
        <button className="global-btn-primary" onClick={handleCreate}>
          Create User
        </button>
      </div>

      <div className="stats-text">Total Records: {users.length}</div>

      {/* Table Component */}
      <UserTable 
        users={currentUsers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={users.length}
        startIndex={startIndex}
        endIndex={endIndex}
      />

      {/* Modal Component */}
      <UserFormModal 
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        roles={roles}
        locations={locations}
        isEditing={!!editingUser}
      />
    </div>
  );
};

export default Users;