import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    name: ''
  });

  // Sample status data
  const sampleStatuses = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Preparing' },
    { id: 4, name: 'Ready' },
    { id: 5, name: 'Out for Delivery' },
    { id: 6, name: 'Delivered' },
    { id: 7, name: 'Cancelled' },
    { id: 8, name: 'Completed' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      await getAllStatus();
    };
    fetchData();
  }, []);


  let getAllStatus = async () => {
    try {
      let response = await apiEndpoints.status.getAll();
      console.log("response", response);
      setStatuses(response.data.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      // Fall back to sample data if API call fails
      setStatuses(sampleStatuses);
    }
  }

  let postNewStatus = async (data) => {
    try {
      let response = await apiEndpoints.status.create(data);
      alert('Status created successfully!', response);
    } catch (error) {
      console.error('Error creating status:', error);
    }
  }

  let updateStatus = async (id, data) => {
    try {
      let response = await apiEndpoints.status.update(id, data);
      alert('Status updated successfully!', response);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  const resetForm = () => {
    setFormData({
      name: ''
    });
  };

  const handleCreate = () => {
    setEditingStatus(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (status) => {
    setEditingStatus(status);
    setFormData({
      name: status.name || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a status name');
      return;
    }

    const existingStatus = statuses.find(s =>
      s.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingStatus || s.id !== editingStatus.id)
    );

    if (existingStatus) {
      alert('A status with this name already exists');
      return;
    }

    if (editingStatus) {
      setStatuses(statuses.map(s =>
        s.id === editingStatus.id
          ? { ...formData, id: editingStatus.id }
          : s
      ));
    } else {
      const newStatus = {
        ...formData,
        id: Math.max(...statuses.map(s => s.id), 0) + 1
      };
      setStatuses([...statuses, newStatus]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      setStatuses(statuses.filter(s => s.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (statusName) => {
    const colors = {
      'pending': { bg: '#fef3c7', text: '#92400e' },
      'confirmed': { bg: '#dbeafe', text: '#1e40af' },
      'preparing': { bg: '#fde68a', text: '#b45309' },
      'ready': { bg: '#dcfce7', text: '#166534' },
      'out for delivery': { bg: '#e0e7ff', text: '#3730a3' },
      'delivered': { bg: '#dcfce7', text: '#166534' },
      'cancelled': { bg: '#fee2e2', text: '#dc2626' },
      'completed': { bg: '#f0fdf4', text: '#15803d' }
    };

    return colors[statusName.toLowerCase()] || { bg: '#f3f4f6', text: '#374151' };
  };

  // Pagination calculations
  const totalPages = Math.ceil(statuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStatuses = statuses.slice(startIndex, endIndex);

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
        marginTop: '2rem',
        gap: '0.5rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: '1rem',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          Showing {startIndex + 1} to {Math.min(endIndex, statuses.length)} of {statuses.length} entries
        </div>
        {pages}
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Status Management</h2>
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
          Create Status
        </button>
      </div>
      <div>Total Records:  {statuses.length}</div>
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
                Status Name
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
            {currentStatuses.map((status) => {
              const statusColor = getStatusColor(status.name);
              return (
                <tr key={status.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    #{status.id}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: statusColor.bg,
                      color: statusColor.text
                    }}>
                      {status.name}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(status)}
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
                        onClick={() => handleDelete(status.id)}
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
      </div>

      {/* Pagination */}
      {renderPagination()}

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
              {editingStatus ? 'Edit Status' : 'Create New Status'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Status Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  placeholder="e.g., Pending, Confirmed, Delivered"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
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
                  {editingStatus ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;