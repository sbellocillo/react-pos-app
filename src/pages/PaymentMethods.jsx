import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });

  // Sample payment methods data
  const samplePaymentMethods = [
    { id: 1, name: 'Cash', is_active: true },
    { id: 2, name: 'Credit Card', is_active: true },
    { id: 3, name: 'Debit Card', is_active: true },
    { id: 4, name: 'GCash', is_active: true },
    { id: 5, name: 'PayMaya', is_active: true },
    { id: 6, name: 'Bank Transfer', is_active: false }
  ];

  useEffect(() => {
    getAllPaymentMethods();
  }, []);

  let getAllPaymentMethods = async () => {
    try {
      let response = await apiEndpoints.paymentMethods.getAll();
      console.log("response", response);
      setPaymentMethods(response.data.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fall back to sample data if API call fails
      setPaymentMethods(samplePaymentMethods);
    }
  }

  let postNewPaymentMethod = async (data) => {
    try {
      let response = await apiEndpoints.paymentMethods.create(data);
      alert('Payment method created successfully!', response);
    } catch (error) {
      console.error('Error creating payment method:', error);
    }
  }

  let updatePaymentMethod = async (id, data) => {
    try {
      let response = await apiEndpoints.paymentMethods.update(id, data);
      alert('Payment method updated successfully!', response);
    } catch (error) {
      console.error('Error updating payment method:', error);
    }
  }

  let deletePaymentMethod = async (id) => {
    try {
      let response = await apiEndpoints.paymentMethods.delete(id);
      alert('Payment method deleted successfully!', response);
    } catch (error) {
      console.error('Error deleting payment method:', error);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      is_active: true
    });
  };

  const handleCreate = () => {
    setEditingPaymentMethod(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (paymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setFormData(paymentMethod);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a payment method name');
      return;
    }

    const existingPaymentMethod = paymentMethods.find(pm =>
      pm.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingPaymentMethod || pm.id !== editingPaymentMethod.id)
    );

    if (existingPaymentMethod) {
      alert('A payment method with this name already exists');
      return;
    }

    if (editingPaymentMethod) {
      setPaymentMethods(paymentMethods.map(pm =>
        pm.id === editingPaymentMethod.id
          ? { ...formData, id: editingPaymentMethod.id }
          : pm
      ));

      updatePaymentMethod(editingPaymentMethod.id, formData);
    } else {
      const newPaymentMethod = {
        ...formData,
        id: Math.max(...paymentMethods.map(pm => pm.id), 0) + 1
      };
      setPaymentMethods([...paymentMethods, newPaymentMethod]);
      postNewPaymentMethod(newPaymentMethod);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      deletePaymentMethod(id);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Pagination calculations
  const totalPages = Math.ceil(paymentMethods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPaymentMethods = paymentMethods.slice(startIndex, endIndex);

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
          Showing {startIndex + 1} to {Math.min(endIndex, paymentMethods.length)} of {paymentMethods.length} entries
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
        <h2 style={{ margin: 0, color: '#1e293b' }}>Payment Methods Management</h2>
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
          Create Payment Method
        </button>
      </div>
      <div>Total Records:  {paymentMethods.length}</div>
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
                Payment Method Name
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                width: '120px'
              }}>
                Status
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
            {currentPaymentMethods.map((paymentMethod) => (
              <tr key={paymentMethod.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{
                  padding: '1rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  #{paymentMethod.id}
                </td>
                <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                  {paymentMethod.name}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    background: paymentMethod.is_active ? '#dcfce7' : '#fee2e2',
                    color: paymentMethod.is_active ? '#166534' : '#dc2626'
                  }}>
                    {paymentMethod.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(paymentMethod)}
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
                      onClick={() => handleDelete(paymentMethod.id)}
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
              {editingPaymentMethod ? 'Edit Payment Method' : 'Create New Payment Method'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Payment Method Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength="50"
                  placeholder="e.g., Cash, Credit Card, GCash"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
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
                  {editingPaymentMethod ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;