import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const ItemTypes = () => {
    const [itemTypes, setItemTypes] = useState([
        {
            id: 1,
            name: 'Appetizers',
            description: 'Small dishes served before the main course',
            isActive: true,
            createdAt: '2024-01-15 10:30:00',
            updatedAt: '2024-02-10 14:20:00'
        },
        {
            id: 2,
            name: 'Main Course',
            description: 'Primary dishes including meats, seafood, and vegetarian options',
            isActive: true,
            createdAt: '2024-01-15 10:32:00',
            updatedAt: '2024-01-15 10:32:00'
        },
        {
            id: 3,
            name: 'Desserts',
            description: 'Sweet treats and after-dinner options',
            isActive: true,
            createdAt: '2024-01-16 09:15:00',
            updatedAt: '2024-03-05 16:45:00'
        },
        {
            id: 4,
            name: 'Beverages',
            description: 'Drinks including soft drinks, juices, and specialty beverages',
            isActive: false,
            createdAt: '2024-02-01 11:20:00',
            updatedAt: '2024-02-20 13:30:00'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true
    });

    useEffect(() => {
        getAllItemTypes();
    }, []);

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

    let postNewItemType = async (data) => {
        try {
            let response = await apiEndpoints.itemTypes.create(data);
            alert('Item type created successfully!', response);
        } catch (error) {
            console.error('Error creating item type:', error);
        }
    }

    let updateItemType = async (id, data) => {
        try {
            let response = await apiEndpoints.itemTypes.update(id, data);
            alert('Item type updated successfully!', response);
        } catch (error) {
            console.error('Error updating item type:', error);
        }
    }

    let deleteItemType = async (id) => {
        try {
            let response = await apiEndpoints.itemTypes.delete(id);
            alert('Item type deleted successfully!', response);
        } catch (error) {
            console.error('Error deleting item type:', error);
        }
    }

    const handleCreate = () => {
        setEditingItem(null);
        setFormData({ name: '', description: '', isActive: true });
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            description: item.description,
            isActive: item.isActive
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
        console.log("save")
        console.log("editingItem", editingItem)
        if (editingItem) {
            // Update existing item
            setItemTypes(itemTypes.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData, updatedAt: now }
                    : item
            ));
            updateItemType(editingItem.id, { ...formData, updated_at: now });
        } else {
            // Create new item
            const newItem = {
                id: Math.max(...itemTypes.map(item => item.id)) + 1,
                ...formData,
                createdAt: now,
                updatedAt: now
            };
            console.log("newItem", newItem)
            setItemTypes([...itemTypes, newItem]);
            postNewItemType({ ...formData, created_at: now, updated_at: now });
        }

        setShowModal(false);
        setFormData({ name: '', description: '', isActive: true });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item type?')) {
            setItemTypes(itemTypes.filter(item => item.id !== id));
            deleteItemType(id);
        }
    };

    // Pagination calculations
    const totalPages = Math.ceil(itemTypes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemTypes.slice(startIndex, endIndex);

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
                    Showing {startIndex + 1} to {Math.min(endIndex, itemTypes.length)} of {itemTypes.length} entries
                </div>
                {pages}
            </div>
        );
    };

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ margin: 0, marginBottom: '0.5rem' }}>Item Types Management</h2>
                    <p style={{ color: '#6b7280', margin: 0 }}>Manage categories and types for your menu items</p>
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
                    Add New Type
                </button>
            </div>
            <div>Total Records:  {itemTypes.length}</div>
            {/* Item Types Table */}
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
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Created At</th>
                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Updated At</th>
                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(item => (
                            <tr key={item.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', color: '#1f2937', fontWeight: '500' }}>{item.name}</td>
                                <td style={{ padding: '1rem', color: '#6b7280', maxWidth: '300px' }}>
                                    <div style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {item.description}
                                    </div>
                                </td>

                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    {new Date(item.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    {new Date(item.updated_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
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
            </div>

            {/* Pagination */}
            {renderPagination()}

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
                        width: '500px',
                        maxWidth: '90vw'
                    }}>
                        <h3 style={{ margin: '0 0 1.5rem 0' }}>
                            {editingItem ? 'Edit Item Type' : 'Create New Item Type'}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
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
                                    placeholder="Enter item type name"
                                />
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
                                    placeholder="Enter description (optional)"
                                />
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

export default ItemTypes;