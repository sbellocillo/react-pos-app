import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(30);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    // Sample customers data
    const sampleCustomers = [
        {
            id: 1,
            first_name: 'Emma',
            last_name: 'Wang',
            email: 'emma.wang@email.com',
            phone: '+63 912 345 6789'
        },
        {
            id: 2,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@email.com',
            phone: '+63 917 890 1234'
        },
        {
            id: 3,
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@email.com',
            phone: '+63 922 567 8901'
        },
        {
            id: 4,
            first_name: 'Mike',
            last_name: 'Johnson',
            email: 'mike.johnson@email.com',
            phone: '+63 918 234 5678'
        },
        {
            id: 5,
            first_name: 'Sarah',
            last_name: 'Wilson',
            email: 'sarah.wilson@email.com',
            phone: '+63 915 678 9012'
        },
        {
            id: 6,
            first_name: 'David',
            last_name: 'Brown',
            email: 'david.brown@email.com',
            phone: '+63 919 345 6789'
        }
    ];

    useEffect(() => {
        // Initialize with sample data
        getAllCustomers();
    }, []);

    let getAllCustomers = async () => {
        try {
            // Assuming there's a customers endpoint similar to locations
            let response = await apiEndpoints.customers.getAll();
            console.log("response", response);
            setCustomers(response.data.data);

            // For now, use sample data since API might not be implemented yet
            //  setCustomers(sampleCustomers);
        } catch (error) {
            console.error('Error fetching customers:', error);
            // Fall back to sample data if API call fails
            setCustomers(sampleCustomers);
        }
    }

    let postNewCustomer = async (data) => {
        try {
            let response = await apiEndpoints.customers.create(data);
            alert('Customer created successfully!', response);
            console.log('Customer created:', data);
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    }

    let updateCustomer = async (id, data) => {
        try {
            let response = await apiEndpoints.customers.update(id, data);
            alert('Customer updated successfully!', response);
            console.log('Customer updated:', id, data);
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    }

    let deleteCustomer = async (id) => {
        try {
            let response = await apiEndpoints.customers.delete(id);
            alert('Customer deleted successfully!', response);
            console.log('Customer deleted:', id);
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }

    const openModal = (customer = null) => {
        setEditingCustomer(customer);
        if (customer) {
            setFormData({
                first_name: customer.first_name || '',
                last_name: customer.last_name || '',
                email: customer.email || '',
                phone: customer.phone || ''
            });
        } else {
            resetForm();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCustomer(null);
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            phone: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.first_name.trim() || !formData.last_name.trim()) {
            alert('Please fill in required fields: First Name and Last Name');
            return;
        }

        if (editingCustomer) {
            // Update existing customer
            setCustomers(customers.map(cust =>
                cust.id === editingCustomer.id
                    ? { ...formData, id: editingCustomer.id }
                    : cust
            ));
            console.log("update", formData);
            updateCustomer(editingCustomer.id, formData);
            console.log("updated customer", customers);
        } else {
            // Create new customer
            const newCustomer = {
                ...formData,
                id: Math.max(...customers.map(c => c.id), 0) + 1
            };
            console.log("create", formData);
            setCustomers([...customers, newCustomer]);
            postNewCustomer(newCustomer);
        }

        setShowModal(false);
        resetForm();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            setCustomers(customers.filter(cust => cust.id !== id));
            deleteCustomer(id);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCustomerName = (customer) => {
        return `${customer.first_name} ${customer.last_name}`.trim();
    };

    // Pagination calculations
    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCustomers = customers.slice(startIndex, endIndex);

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
                        background: currentPage === i ? '#dc2626' : 'white',
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
                padding: '1rem',
                gap: '0.5rem'
            }}>
                <span style={{ marginRight: '1rem', color: '#6b7280' }}>
                    Showing {startIndex + 1}-{Math.min(endIndex, customers.length)} of {customers.length} customers
                </span>
                {pages}
            </div>
        );
    };

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: '#1f2937', fontSize: '2rem' }}>Customers</h1>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                        Manage customer information and contact details
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    }}
                >
                    <span>+</span>
                    Add New Customer
                </button>
            </div>

            {/* Summary Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div>Total Records:  {customers.length}</div>

            </div>

            {/* Customers Table */}
            <div style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'auto',
                height: '400px'
            }}>
                <div style={{
                    overflowX: 'auto'
                }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '600'
                                }}>
                                    ID
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '600'
                                }}>
                                    Name
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '600'
                                }}>
                                    Email
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '600'
                                }}>
                                    Phone
                                </th>
                                <th style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    borderBottom: '1px solid #e5e7eb',
                                    color: '#374151',
                                    fontWeight: '600',
                                    width: '150px'
                                }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCustomers.map((customer, index) => (
                                <tr key={customer.id} style={{
                                    borderBottom: '1px solid #f1f5f9',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                        #{customer.id}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500', color: '#1f2937' }}>
                                            {formatCustomerName(customer)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                        {customer.email || 'N/A'}
                                    </td>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                                        {customer.phone || 'N/A'}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            <button
                                                onClick={() => openModal(customer)}
                                                style={{
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0.5rem 1rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                                                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(customer.id)}
                                                style={{
                                                    background: '#ef4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0.5rem 1rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
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

                    {currentCustomers.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem',
                            color: '#6b7280'
                        }}>
                            No customers found. Add your first customer to get started.
                        </div>
                    )}
                </div>

                {/* Pagination */}
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
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
                                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                            </h2>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
                                onMouseOut={(e) => e.target.style.background = 'none'}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontWeight: '500',
                                        color: '#374151'
                                    }}>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s ease'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                                        onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    fontWeight: '500',
                                    color: '#374151'
                                }}>
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+63 912 345 6789"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#dc2626'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        background: '#6b7280',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.target.style.background = '#4b5563'}
                                    onMouseOut={(e) => e.target.style.background = '#6b7280'}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                                    }}
                                >
                                    {editingCustomer ? 'Update Customer' : 'Add Customer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;