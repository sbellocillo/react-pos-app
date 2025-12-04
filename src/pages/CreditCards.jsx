import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const CreditCards = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCreditCard, setEditingCreditCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });

  // Sample credit cards data
  const sampleCreditCards = [
    { id: 1, name: 'Visa', is_active: true },
    { id: 2, name: 'Mastercard', is_active: true },
    { id: 3, name: 'American Express', is_active: true },
    { id: 4, name: 'JCB', is_active: true },
    { id: 5, name: 'Discover', is_active: true },
    { id: 6, name: 'UnionPay', is_active: true },
    { id: 7, name: 'Diners Club', is_active: false }
  ];

  useEffect(() => {
    getAllCreditCards();
  }, []);

  let getAllCreditCards = async () => {
    try {
      let response = await apiEndpoints.creditCards.getAll();
      console.log("response", response);
      setCreditCards(response.data.data);
    } catch (error) {
      console.error('Error fetching credit cards:', error);
      // Fall back to sample data if API call fails
      setCreditCards(sampleCreditCards);
    }
  }

  let postNewCreditCard = async (data) => {
    try {
      let response = await apiEndpoints.creditCards.create(data);
      alert('Credit card created successfully!', response);
    } catch (error) {
      console.error('Error creating credit card:', error);
    }
  }

  let updateCreditCard = async (id, data) => {
    try {
      let response = await apiEndpoints.creditCards.update(id, data);
      alert('Credit card updated successfully!', response);
    } catch (error) {
      console.error('Error updating credit card:', error);
    }
  }

  let deleteCreditCard = async (id) => {
    try {
      let response = await apiEndpoints.creditCards.delete(id);
      alert('Credit card deleted successfully!', response);
    } catch (error) {
      console.error('Error deleting credit card:', error);
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      is_active: true
    });
  };

  const handleCreate = () => {
    setEditingCreditCard(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (creditCard) => {
    setEditingCreditCard(creditCard);
    setFormData(creditCard);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Please enter a credit card name');
      return;
    }

    const existingCreditCard = creditCards.find(c =>
      c.name.toLowerCase() === formData.name.toLowerCase() &&
      (!editingCreditCard || c.id !== editingCreditCard.id)
    );

    if (existingCreditCard) {
      alert('A credit card with this name already exists!');
      return;
    }

    if (editingCreditCard) {
      updateCreditCard(editingCreditCard.id, formData);
      setCreditCards(creditCards.map(c =>
        c.id === editingCreditCard.id ? { ...c, ...formData } : c
      ));
    } else {
      const newCreditCard = {
        ...formData,
        id: Math.max(...creditCards.map(c => c.id), 0) + 1
      };
      postNewCreditCard(formData);
      setCreditCards([...creditCards, newCreditCard]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this credit card?')) {
      deleteCreditCard(id);
      setCreditCards(creditCards.filter(c => c.id !== id));
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = creditCards.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(creditCards.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Credit Cards</h1>
            <p style={{ margin: 0, color: '#64748b' }}>Manage credit card types accepted in your system</p>
          </div>
          <button
            onClick={handleCreate}
            style={{
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';
            }}
          >
            + Add Credit Card
          </button>
        </div>

        {/* Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>ID</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Credit Card Name</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Status</th>
                <th style={{
                  padding: '1rem',
                  textAlign: 'center',
                  fontWeight: '600',
                  color: '#475569',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((creditCard, index) => (
                <tr
                  key={creditCard.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                    {creditCard.id}
                  </td>
                  <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '500' }}>
                    {creditCard.name}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: creditCard.is_active ? '#dcfce7' : '#fee2e2',
                      color: creditCard.is_active ? '#166534' : '#991b1b'
                    }}>
                      {creditCard.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(creditCard)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#2563eb'}
                        onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(creditCard.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#dc2626'}
                        onMouseOut={(e) => e.target.style.background = '#ef4444'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {currentItems.length === 0 && (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              No credit cards found. Click "Add Credit Card" to create one.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '2rem',
            gap: '0.5rem'
          }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: currentPage === 1 ? '#f8fafc' : 'white',
                color: currentPage === 1 ? '#cbd5e1' : '#475569',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  background: currentPage === index + 1 ? '#dc2626' : 'white',
                  color: currentPage === index + 1 ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontWeight: '500',
                  minWidth: '40px'
                }}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                background: currentPage === totalPages ? '#f8fafc' : 'white',
                color: currentPage === totalPages ? '#cbd5e1' : '#475569',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              Next
            </button>
          </div>
        )}
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
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>
              {editingCreditCard ? 'Edit Credit Card' : 'Add New Credit Card'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#475569',
                  fontWeight: '500',
                  fontSize: '0.875rem'
                }}>
                  Credit Card Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter credit card name (e.g., Visa, Mastercard)"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      marginRight: '0.75rem',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ color: '#475569', fontWeight: '500', fontSize: '0.875rem' }}>
                    Active
                  </span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    background: 'white',
                    color: '#475569',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 12px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 6px rgba(220, 38, 38, 0.2)';
                  }}
                >
                  {editingCreditCard ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditCards;
