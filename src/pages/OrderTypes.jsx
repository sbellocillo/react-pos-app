import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const OrderTypes = () => {
  const [orderTypes, setOrderTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrderType, setEditingOrderType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    name: ''
  });

  // Sample order types data
  const sampleOrderTypes = [
    { id: 1, name: 'Dine In' },
    { id: 2, name: 'Take Out' },
    { id: 3, name: 'Delivery' },
    { id: 4, name: 'Drive Thru' },
    { id: 5, name: 'Catering' }
  ];

  useEffect(() => {
    // Initialize with sample data
    getAllOrderTypes();
  }, []);

  let getAllOrderTypes = async () => {
    try {
      let response = await apiEndpoints.orderTypes.getAll();
      console.log("response", response);
      setOrderTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching order types:', error);
      // Fall back to sample data if API call fails
      setOrderTypes(sampleOrderTypes);
    }
  }

  let postNewOrderType = async (data) => {
    try {
      let response = await apiEndpoints.orderTypes.create(data);
      alert('Order type created successfully!', response);
    } catch (error) {
      console.error('Error creating order type:', error);
    }
  }

  let updateOrderType = async (id, data) => {
    try {
      let response = await apiEndpoints.orderTypes.update(id, data);
      alert('Order type updated successfully!', response);
    } catch (error) {
      console.error('Error updating order type:', error);
    }
  }

  let deleteOrderType = async (id) => {
    try {
      let response = await apiEndpoints.orderTypes.delete(id);
      alert('Order type deleted successfully!', response);
    } catch (error) {
      console.error('Error deleting order type:', error);
    }
  }

  const resetForm = () => {
    setFormData({
      name: ''
    });
  };

  const handleCreate = () => {
    setEditingOrderType(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (orderType) => {
    setEditingOrderType(orderType);
    setFormData(orderType);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter an order type name');
      return;
    }

    // Check for duplicate names
    const existingOrderType = orderTypes.find(ot =>
      ot.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingOrderType || ot.id !== editingOrderType.id)
    );

    if (existingOrderType) {
      alert('An order type with this name already exists');
      return;
    }

    if (editingOrderType) {
      // Update existing order type
      setOrderTypes(orderTypes.map(ot =>
        ot.id === editingOrderType.id
          ? { ...formData, id: editingOrderType.id }
          : ot
      ));
      updateOrderType(editingOrderType.id, { ...formData, updated_at: new Date().toISOString() });
    } else {
      // Create new order type
      const newOrderType = {
        ...formData,
        id: Math.max(...orderTypes.map(ot => ot.id), 0) + 1
      };
      setOrderTypes([...orderTypes, newOrderType]);
      postNewOrderType({ ...formData, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order type?')) {
      setOrderTypes(orderTypes.filter(ot => ot.id !== id));
      deleteOrderType(id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pagination calculations
  const totalPages = Math.ceil(orderTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrderTypes = orderTypes.slice(startIndex, endIndex);

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
          Showing {startIndex + 1} to {Math.min(endIndex, orderTypes.length)} of {orderTypes.length} entries
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
        <h2 style={{ margin: 0, color: '#1e293b' }}>Order Types Management</h2>
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
          Create Order Type
        </button>
      </div>
      <div>Total Records:  {orderTypes.length}</div>
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
                Order Type Name
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
            {currentOrderTypes.map((orderType) => (
              <tr key={orderType.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{
                  padding: '1rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  #{orderType.id}
                </td>
                <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                  {orderType.name}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(orderType)}
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
                      onClick={() => handleDelete(orderType.id)}
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
            ))}
            {orderTypes.length === 0 && (
              <tr>
                <td colSpan="3" style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  No order types found. Create your first order type to get started.
                </td>
              </tr>
            )}
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
              {editingOrderType ? 'Edit Order Type' : 'Create New Order Type'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Order Type Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  placeholder="e.g., Dine In, Take Out, Delivery"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <div style={{
                  marginTop: '0.25rem',
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Maximum 50 characters
                </div>
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
                  {editingOrderType ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTypes;