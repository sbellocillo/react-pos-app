import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const Items = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'BBQ Ribs',
      description: 'Tender slow-cooked ribs with our signature BBQ sauce',
      price: 24.99,
      sku: 'RIB-001',
      category_id: 2,
      item_type_name: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      isActive: true,
      createdAt: '2024-01-15 10:30:00',
      updatedAt: '2024-02-10 14:20:00'
    },
    {
      id: 2,
      name: 'Buffalo Wings',
      description: 'Crispy chicken wings tossed in spicy buffalo sauce',
      price: 12.99,
      sku: 'APP-001',
      category_id: 1,
      item_type_name: 'Appetizers',
      imageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2',
      isActive: true,
      createdAt: '2024-01-16 09:15:00',
      updatedAt: '2024-01-16 09:15:00'
    },
    {
      id: 3,
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with chocolate frosting',
      price: 8.99,
      sku: 'DES-001',
      category_id: 3,
      item_type_name: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      isActive: true,
      createdAt: '2024-01-17 11:20:00',
      updatedAt: '2024-03-05 16:45:00'
    },
    {
      id: 4,
      name: 'Seasonal Salad',
      description: 'Mixed greens with seasonal vegetables and house dressing',
      price: 14.99,
      sku: 'SAL-001',
      category_id: 2,
      item_type_name: 'Main Course',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
      isActive: false,
      createdAt: '2024-02-01 14:30:00',
      updatedAt: '2024-02-15 10:22:00'
    }
  ]);

  // Available item types for dropdown
  // const [itemTypes] = useState([
  //   { id: 1, name: 'Appetizers' },
  //   { id: 2, name: 'Main Course' },
  //   { id: 3, name: 'Desserts' },
  //   { id: 4, name: 'Beverages' }
  // ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemTypes, setItemTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    sku: '',
    category_id: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    // Initialize with sample data
    //setLocations(sampleLocations);

    getAllItemTypes();
    getAllItems();
  }, []);


  let getAllItems = async () => {
    try {
      let response = await apiEndpoints.items.getAll();
      console.log("getAllItems response", response);
      setItems(response.data.data);
      //setFormData(response.data.data.category_id);
      //  setFormData({ ...formData, category_id: response.data.data.category_id})
    } catch (error) {
      console.error('Error fetching items:', error);
      // Fall back to sample data if API call fails
      setItems(items);
    }
  }

  let getAllItemTypes = async () => {
    try {
      let response = await apiEndpoints.itemTypes.getAll();
      console.log("getAllItemTypes response", response);
      setItemTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching item types:', error);
      // Keep existing sample data if API call fails
    }
  }


  let postNewItem = async (data) => {
    try {
      console.log("Posting new item with data:", data);
      let response = await apiEndpoints.items.create(data);
      alert('Item created successfully!', response);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }

  let updateItem = async (id, data) => {
    try {
      let response = await apiEndpoints.items.update(id, data);
      alert('Item updated successfully!', response);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  }

  let deleteItem = async (id) => {
    try {
      let response = await apiEndpoints.items.delete(id);
      alert('Item deleted successfully!', response);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      sku: '',
      category_id: '',
      image: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price || '',
      sku: item.sku || '',
      category_id: item.category_id || '',
      image: item.image || '',
      isActive: item.isActive !== undefined ? item.isActive : true
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date().toLocaleString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    const selectedItemType = itemTypes.find(type => type.id === parseInt(formData.category_id));

    if (editingItem) {
      // Update existing item
      setItems(items.map(item =>
        item.id === editingItem.id
          ? {
            ...item,
            ...formData,
            price: parseFloat(formData.price),
            category_id: parseInt(formData.category_id),
            item_type_name: selectedItemType?.name || '',
            updatedAt: now
          }
          : item
      ));
      console.log("199 Updating item with data:", formData);
      console.log("200 editingItem:", editingItem);
      updateItem(editingItem.id, formData);
    } else {
      // Create new item
      const newItem = {
        id: Math.max(...items.map(item => item.id)) + 1,
        ...formData,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        item_type_name: selectedItemType?.name || '',
        createdAt: now,
        updatedAt: now
      };
      setItems([...items, newItem]);
      postNewItem(newItem);
    }

    setShowModal(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      sku: '',
      category_id: '',
      imageUrl: '',
      isActive: true
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
      await deleteItem(id);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

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
            Showing {startIndex + 1}-{Math.min(endIndex, items.length)} of {items.length} items
          </span>
          <div style={{ display: 'flex' }}>
            {pages}
          </div>
        </div>
      </div>
    );
  };

  function formatToMMDDYYYY(isoDate) {
    const date = new Date(isoDate);

    // Get month, day, year
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }


  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Items Management</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>Manage menu items, pricing, and inventory</p>
        </div>
        <button
          onClick={handleCreate}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>+</span>
          Add New Item
        </button>

      </div>

      {/* Items Table */}
      <div>Total Records:  {items.length}</div>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '650px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Image</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Price</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>SKU</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Type</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Created</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Updated</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (

              <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#f3f4f6',
                      borderRadius: '8px',
                      border: '2px solid #e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '0.75rem'
                    }}>
                      No Image
                    </div>
                  )}
                </td>

                <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '500' }}>{item.name}</td>
                <td style={{ padding: '1rem', color: '#6b7280', maxWidth: '200px' }}>
                  <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.description}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#1f2937', textAlign: 'right', fontWeight: '600' }}>
                  PHP {item.price}
                </td>
                <td style={{ padding: '1rem', color: '#6b7280', fontFamily: 'monospace' }}>
                  {item.sku}
                </td>
                <td style={{ padding: '1rem', color: '#6b7280' }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    {item.category_name}
                  </span>
                </td>

                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {formatToMMDDYYYY(item.created_at)}
                </td>
                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  {formatToMMDDYYYY(item.updated_at)}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '0.25rem 0.75rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
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
        {/* Pagination */}
        {renderPagination()}
      </div>

      {/* Modal for Create/Edit */}
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
            width: '600px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>
              {editingItem ? 'Edit Item' : 'Create New Item'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="Enter item description"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  Image URL
                </label>
                <textarea
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                  placeholder="Enter image URL (optional)"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      fontFamily: 'monospace'
                    }}
                    placeholder="Enter SKU code"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                    Item Type *
                  </label>
                  {console.log("formData. category", formData)}
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Select Item Category...</option>
                    {itemTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: '600', color: '#374151' }}>Active</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Items;