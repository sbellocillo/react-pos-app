import { useState, useEffect } from 'react';
import axios from 'axios';

const TaxConfig = () => {
  const [taxConfigs, setTaxConfigs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTaxConfig, setEditingTaxConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    name: '',
    tax_percentage: '',
    description: '',
    is_default: false,
    location_id: '',
    effective_date: new Date().toISOString().split('T')[0]
  });

  // Sample locations for dropdown
  const sampleLocations = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'BGC Branch' },
    { id: 3, name: 'Ortigas Branch' }
  ];

  // Sample tax configs data
  const sampleTaxConfigs = [
    {
      id: 1,
      name: 'Standard VAT',
      tax_percentage: 0.1200,
      description: 'Standard 12% Value Added Tax',
      is_default: true,
      location_id: null,
      location_name: 'All Locations',
      effective_date: '2024-01-01'
    },
    {
      id: 2,
      name: 'Senior Citizen Discount',
      tax_percentage: 0.0000,
      description: 'Tax exemption for senior citizens',
      is_default: false,
      location_id: 1,
      location_name: 'Main Branch',
      effective_date: '2024-01-01'
    },
    {
      id: 3,
      name: 'Special Economic Zone',
      tax_percentage: 0.0600,
      description: '6% reduced tax rate for SEZ locations',
      is_default: false,
      location_id: 2,
      location_name: 'BGC Branch',
      effective_date: '2024-01-01'
    }
  ];

  useEffect(() => {
    setTaxConfigs(sampleTaxConfigs);
    setLocations(sampleLocations);
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      tax_percentage: '',
      description: '',
      is_default: false,
      location_id: '',
      effective_date: new Date().toISOString().split('T')[0]
    });
  };

  const handleCreate = () => {
    setEditingTaxConfig(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (taxConfig) => {
    setEditingTaxConfig(taxConfig);
    setFormData({
      ...taxConfig,
      tax_percentage: (taxConfig.tax_percentage * 100).toFixed(4),
      location_id: taxConfig.location_id || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.tax_percentage) {
      alert('Please fill in all required fields');
      return;
    }

    const taxPercentage = parseFloat(formData.tax_percentage) / 100;
    if (taxPercentage < 0 || taxPercentage > 1) {
      alert('Tax percentage must be between 0% and 100%');
      return;
    }

    const locationName = formData.location_id
      ? locations.find(l => l.id === parseInt(formData.location_id))?.name
      : 'All Locations';

    const taxConfigData = {
      ...formData,
      tax_percentage: taxPercentage,
      location_id: formData.location_id ? parseInt(formData.location_id) : null,
      location_name: locationName
    };

    if (editingTaxConfig) {
      setTaxConfigs(taxConfigs.map(tc =>
        tc.id === editingTaxConfig.id
          ? { ...taxConfigData, id: editingTaxConfig.id }
          : tc
      ));
    } else {
      const newTaxConfig = {
        ...taxConfigData,
        id: Math.max(...taxConfigs.map(tc => tc.id), 0) + 1
      };
      setTaxConfigs([...taxConfigs, newTaxConfig]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tax configuration?')) {
      setTaxConfigs(taxConfigs.filter(tc => tc.id !== id));
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
  const totalPages = Math.ceil(taxConfigs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTaxConfigs = taxConfigs.slice(startIndex, endIndex);

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
          Showing {startIndex + 1} to {Math.min(endIndex, taxConfigs.length)} of {taxConfigs.length} entries
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
        <h2 style={{ margin: 0, color: '#1e293b' }}>Tax Configuration Management</h2>
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
          Create Tax Config
        </button>
      </div>
      <div>Total Records:  {taxConfigs.length}</div>
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
                borderBottom: '1px solid #e5e7eb'
              }}>
                Name
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Tax Rate
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
                borderBottom: '1px solid #e5e7eb'
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
            {currentTaxConfigs.map((taxConfig) => (
              <tr key={taxConfig.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {taxConfig.name}
                    </div>
                    {taxConfig.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {taxConfig.description}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                  {(taxConfig.tax_percentage * 100).toFixed(2)}%
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>
                  {taxConfig.location_name}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    background: taxConfig.is_default ? '#dbeafe' : '#f3f4f6',
                    color: taxConfig.is_default ? '#1e40af' : '#374151'
                  }}>
                    {taxConfig.is_default ? 'Default' : 'Custom'}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleEdit(taxConfig)}
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
                      onClick={() => handleDelete(taxConfig.id)}
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
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              {editingTaxConfig ? 'Edit Tax Configuration' : 'Create New Tax Configuration'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength="100"
                  placeholder="e.g., Standard VAT, Senior Discount"
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
                  Tax Percentage (%) *
                </label>
                <input
                  type="number"
                  name="tax_percentage"
                  value={formData.tax_percentage}
                  onChange={handleChange}
                  required
                  min="0"
                  max="100"
                  step="0.0001"
                  placeholder="12.0000"
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
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional description of this tax configuration"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
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
                  Location
                </label>
                <select
                  name="location_id"
                  value={formData.location_id}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
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
                  Effective Date
                </label>
                <input
                  type="date"
                  name="effective_date"
                  value={formData.effective_date}
                  onChange={handleChange}
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
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  Set as Default Tax Configuration
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
                  {editingTaxConfig ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxConfig;