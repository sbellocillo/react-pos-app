import { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  const [formData, setFormData] = useState({
    customer_id: '',
    user_id: '',
    order_date: new Date().toISOString().slice(0, 16),
    shipping_address: '',
    billing_address: '',
    status_id: '',
    order_type_id: '',
    subtotal: '',
    tax_percentage: '12.00',
    tax_amount: '0.00',
    total: '',
    role_id: '',
    location_id: '',
    payment_method_id: '',
    is_active: true
  });

  // Sample data for dropdowns
  const sampleLocations = [
    { id: 1, name: 'Main Branch' },
    { id: 2, name: 'BGC Branch' },
    { id: 3, name: 'Ortigas Branch' }
  ];

  const sampleOrderTypes = [
    { id: 1, name: 'Dine In' },
    { id: 2, name: 'Take Out' },
    { id: 3, name: 'Delivery' }
  ];

  const sampleStatuses = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Preparing' },
    { id: 4, name: 'Ready' },
    { id: 5, name: 'Completed' }
  ];

  const samplePaymentMethods = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'GCash' }
  ];

  const sampleRoles = [
    { id: 1, name: 'Administrator' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Cashier' }
  ];

  const sampleCustomers = [
    { id: 1001, name: 'John Doe', email: 'john.doe@email.com', phone: '+63 912 345 6789' },
    { id: 1002, name: 'Jane Smith', email: 'jane.smith@email.com', phone: '+63 917 890 1234' },
    { id: 1003, name: 'Mike Johnson', email: 'mike.johnson@email.com', phone: '+63 922 567 8901' },
    { id: 1004, name: 'Sarah Wilson', email: 'sarah.wilson@email.com', phone: '+63 928 234 5678' },
    { id: 1005, name: 'David Brown', email: 'david.brown@email.com', phone: '+63 935 678 9012' }
  ];

  const sampleUsers = [
    { id: 1, username: 'admin@ribshack.com', name: 'Admin User', role: 'Administrator' },
    { id: 2, username: 'manager.main@ribshack.com', name: 'Main Branch Manager', role: 'Manager' },
    { id: 3, username: 'cashier1@ribshack.com', name: 'Cashier One', role: 'Cashier' },
    { id: 4, username: 'cashier2@ribshack.com', name: 'Cashier Two', role: 'Cashier' },
    { id: 5, username: 'manager.bgc@ribshack.com', name: 'BGC Branch Manager', role: 'Manager' }
  ];

  // Sample orders data
  const sampleOrders = [
    {
      id: 1,
      customer_id: 1001,
      customer_name: 'John Doe',
      user_id: 3,
      user_name: 'Cashier One',
      order_date: '2024-11-21T14:30:00',
      shipping_address: '123 Rizal St, Makati City',
      billing_address: '123 Rizal St, Makati City',
      status_id: 2,
      status_name: 'Confirmed',
      order_type_id: 3,
      order_type_name: 'Delivery',
      subtotal: 850.00,
      tax_percentage: 0.1200,
      tax_amount: 102.00,
      total: 952.00,
      role_id: 3,
      role_name: 'Cashier',
      location_id: 1,
      location_name: 'Main Branch',
      payment_method_id: 2,
      payment_method_name: 'Credit Card',
      is_active: true
    },
    {
      id: 2,
      customer_id: 1002,
      customer_name: 'Jane Smith',
      user_id: 4,
      user_name: 'Cashier Two',
      order_date: '2024-11-21T12:15:00',
      shipping_address: '',
      billing_address: '',
      status_id: 5,
      status_name: 'Completed',
      order_type_id: 1,
      order_type_name: 'Dine In',
      subtotal: 650.00,
      tax_percentage: 0.1200,
      tax_amount: 78.00,
      total: 728.00,
      role_id: 3,
      role_name: 'Cashier',
      location_id: 2,
      location_name: 'BGC Branch',
      payment_method_id: 1,
      payment_method_name: 'Cash',
      is_active: true
    },
    {
      id: 3,
      customer_id: 1003,
      customer_name: 'Mike Johnson',
      user_id: 2,
      user_name: 'Main Branch Manager',
      order_date: '2024-11-21T16:45:00',
      shipping_address: '456 EDSA, Ortigas',
      billing_address: '456 EDSA, Ortigas',
      status_id: 3,
      status_name: 'Preparing',
      order_type_id: 2,
      order_type_name: 'Take Out',
      subtotal: 1200.00,
      tax_percentage: 0.1200,
      tax_amount: 144.00,
      total: 1344.00,
      role_id: 2,
      role_name: 'Manager',
      location_id: 3,
      location_name: 'Ortigas Branch',
      payment_method_id: 3,
      payment_method_name: 'GCash',
      is_active: true
    }
  ];

  // useEffect(() => {
  //   const loadData = async () => {
  //     await Promise.all([
  //     // getAllOrders();
  //     getAllLocations();
  //     setOrderTypes(sampleOrderTypes);
  //     setStatuses(sampleStatuses);
  //     setPaymentMethods(samplePaymentMethods);
  //     setRoles(sampleRoles);
  //     getAllCustomers();
  //     setUsers(sampleUsers);
  //   ]);
  // }
  //   loadData();
  // }, []);

  //   
  useEffect(() => {
    const loadData = async () => {

      await Promise.all([
        getAllOrders(),
        getAllLocations(),
        getAllOrderTypes(),
        getAllStatus(),
        getAllPaymentMethods(),
        getAllRoles(),
        getAllCustomers(),
        getAllUsers()
      ]);

    };

    loadData();
  }, []);

  let getAllOrders = async () => {
    // Placeholder for fetching orders from an API
    let response = await apiEndpoints.orders.getAll();
    console.log("get all orders", response.data.data);
    setOrders(response.data.data);
    try {
      let response = await axios.get('/api/orders');
    } catch (e) {

    }
  }

  let getAllPaymentMethods = async () => {
    try {
      let response = await apiEndpoints.paymentMethods.getAll();
      console.log("getAllPaymentMethods response", response.data.data);
      setPaymentMethods(response.data.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fall back to sample data if API call fails
      setPaymentMethods(samplePaymentMethods);
    }
  }

  let getAllOrderTypes = async () => {
    try {
      let response = await apiEndpoints.orderTypes.getAll();
      console.log("getAllOrderTypes response", response.data.data);
      setOrderTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching order types:', error);
      // Fall back to sample data if API call fails
      setOrderTypes(sampleOrderTypes);
    }
  }

  let getAllStatus = async () => {
    try {
      let response = await apiEndpoints.status.getAll();
      console.log("getAllStatus response", response.data.data);
      setStatuses(response.data.data);
    } catch (error) {
      console.error('Error fetching statuses:', error);
      // Fall back to sample data if API call fails
      setStatuses(sampleStatuses);
    }
  }
  let getAllLocations = async () => {
    try {
      let response = await apiEndpoints.locations.getAll();
      console.log("getAllLocations response", response.data.data);
      setLocations(response.data.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Fall back to sample data if API call fails
      setLocations(sampleLocations);
    }
  }

  let getAllCustomers = async () => {
    try {
      // Assuming there's a customers endpoint similar to locations
      let response = await apiEndpoints.customers.getAll();
      console.log("getAllCustomers response", response.data.data);
      setCustomers(response.data.data);

      // For now, use sample data since API might not be implemented yet
      //  setCustomers(sampleCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fall back to sample data if API call fails
      setCustomers(sampleCustomers);
    }
  }


  let getAllRoles = async () => {
    try {
      let response = await apiEndpoints.roles.getAll();
      console.log("getAllRoles response", response.data.data);
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      // Fall back to sample data if API call fails
      setRoles(sampleRoles);
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
  let postNewOrder = async (data) => {
    try {
      let response = apiEndpoints.orders.create(data);
      alert('Order created successfully');
    } catch (e) {
      console.error('Error creating location:', error);
    }
  }

  let updateOrder = async (id, data) => {
    try {
      let response = apiEndpoints.orders.update(id, data);
      alert('Order updated successfully');
    } catch (e) {
      console.error('Error updating order:', e);
    }
  }

  const resetForm = () => {
    setFormData({
      customer_id: '',
      user_id: '',
      order_date: new Date().toISOString().slice(0, 16),
      shipping_address: '',
      billing_address: '',
      status_id: '',
      order_type_id: '',
      subtotal: '',
      tax_percentage: '12.00',
      tax_amount: '0.00',
      total: '',
      role_id: '',
      location_id: '',
      payment_method_id: '',
      is_active: true
    });
  };

  const calculateTaxAndTotal = (subtotal, taxPercentage) => {
    const subtotalNum = parseFloat(subtotal) || 0;
    const taxRate = parseFloat(taxPercentage) / 100 || 0;
    const taxAmount = subtotalNum * taxRate;
    const total = subtotalNum + taxAmount;

    return {
      tax_amount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleCreate = () => {
    setEditingOrder(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customer_id: order.customer_id?.toString() || '',
      user_id: order.user_id?.toString() || '',
      order_date: order.order_date.slice(0, 16),
      shipping_address: order.shipping_address || '',
      billing_address: order.billing_address || '',
      status_id: order.status_id?.toString() || '',
      order_type_id: order.order_type_id?.toString() || '',
      subtotal: order.subtotal?.toString() || '',
      tax_percentage: (order.tax_percentage * 100).toFixed(2),
      tax_amount: parseFloat(order.tax_amount).toFixed(2) || '0.00',
      total: order.total?.toString() || '',
      role_id: order.role_id?.toString() || '',
      location_id: order.location_id?.toString() || '',
      payment_method_id: order.payment_method_id?.toString() || '',
      is_active: order.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customer_id || !formData.user_id || !formData.subtotal || !formData.status_id ||
      !formData.order_type_id || !formData.role_id || !formData.location_id ||
      !formData.payment_method_id) {
      alert('Please fill in all required fields');
      return;
    }

    const calculations = calculateTaxAndTotal(formData.subtotal, formData.tax_percentage);

    const orderData = {
      customer_id: parseInt(formData.customer_id),
      customer_name: customers.find(c => c.id === parseInt(formData.customer_id))?.name || '',
      user_id: parseInt(formData.user_id),
      user_name: users.find(u => u.id === parseInt(formData.user_id))?.name || '',
      order_date: formData.order_date,
      shipping_address: formData.shipping_address,
      billing_address: formData.billing_address,
      status_id: parseInt(formData.status_id),
      status_name: statuses.find(s => s.id === parseInt(formData.status_id))?.name || '',
      order_type_id: parseInt(formData.order_type_id),
      order_type_name: orderTypes.find(ot => ot.id === parseInt(formData.order_type_id))?.name || '',
      subtotal: parseFloat(formData.subtotal),
      tax_percentage: parseFloat(formData.tax_percentage) / 100,
      tax_amount: parseFloat(calculations.tax_amount),
      total: parseFloat(calculations.total),
      role_id: parseInt(formData.role_id),
      role_name: roles.find(r => r.id === parseInt(formData.role_id))?.name || '',
      location_id: parseInt(formData.location_id),
      location_name: locations.find(l => l.id === parseInt(formData.location_id))?.name || '',
      payment_method_id: parseInt(formData.payment_method_id),
      payment_method_name: paymentMethods.find(pm => pm.id === parseInt(formData.payment_method_id))?.name || '',
      is_active: formData.is_active
    };

    if (editingOrder) {
      setOrders(orders.map(order =>
        order.id === editingOrder.id
          ? { ...orderData, id: editingOrder.id }
          : order
      ));
    } else {
      const newOrder = {
        ...orderData,
        id: Math.max(...orders.map(o => o.id), 0) + 1
      };
      setOrders([...orders, newOrder]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Auto-calculate tax and total when subtotal or tax percentage changes
    if (name === 'subtotal' || name === 'tax_percentage') {
      const calculations = calculateTaxAndTotal(
        name === 'subtotal' ? value : newFormData.subtotal,
        name === 'tax_percentage' ? value : newFormData.tax_percentage
      );
      newFormData = {
        ...newFormData,
        tax_amount: calculations.tax_amount,
        total: calculations.total
      };
    }

    setFormData(newFormData);
  };

  const getStatusColor = (statusName) => {
    const colors = {
      'pending': { bg: '#fef3c7', text: '#92400e' },
      'confirmed': { bg: '#dbeafe', text: '#1e40af' },
      'preparing': { bg: '#fde68a', text: '#b45309' },
      'ready': { bg: '#dcfce7', text: '#166534' },
      'completed': { bg: '#f0fdf4', text: '#15803d' }
    };
    return colors[statusName?.toLowerCase()] || { bg: '#f3f4f6', text: '#374151' };
  };

  // Filter orders by date range and location
  const filteredOrders = orders.filter(order => {
    // Date filtering
    if (dateFrom || dateTo) {
      const orderDate = new Date(order.order_date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo + 'T23:59:59') : null;

      if (fromDate && orderDate < fromDate) return false;
      if (toDate && orderDate > toDate) return false;
    }

    // Location filtering
    if (selectedLocation && order.location_id !== parseInt(selectedLocation)) {
      return false;
    }

    return true;
  });

  // Calculate total from filtered orders
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo]);

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
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
          </span>
          <div style={{ display: 'flex' }}>
            {pages}
          </div>
        </div>
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
        <h2 style={{ margin: 0, color: '#1e293b' }}>Orders Management</h2>
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
          Create Order
        </button>
      </div>

      {/* Date Filter and Total Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#374151' }}>Date From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#374151',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#374151' }}>Date To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#374151',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#374151' }}>Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '2px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '0.9rem',
              color: '#374151',
              outline: 'none',
              background: 'white',
              minWidth: '150px'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">All Locations</option>
            {sampleLocations.map(location => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => { setDateFrom(''); setDateTo(''); setSelectedLocation(''); }}
          style={{
            padding: '0.5rem 1rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}
        >
          Clear Filter
        </button>

        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: '#f8fafc',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          border: '2px solid #e5e7eb'
        }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>Orders Found:</span>
          <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1.1rem' }}>
            {filteredOrders.length}
          </span>
          <span style={{ fontWeight: '600', color: '#374151', marginLeft: '1rem' }}>Total Amount:</span>
          <span style={{
            fontWeight: 'bold',
            color: '#10b981',
            fontSize: '1.2rem',
            background: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #10b981'
          }}>
            ₱{totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
      <div>Total Records:  {orders.length}</div>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '650px'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', width: '80px' }}>
                  Order ID
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Customer
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  User
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Date/Time
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Type
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Location
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Total
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Payment
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', width: '200px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                const statusColor = getStatusColor(order.status_name);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#6b7280' }}>
                      #{order.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1e293b' }}>
                          {order.customer_name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          ID: {order.customer_id}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1e293b' }}>
                          {order.user_name}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          ID: {order.user_id}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(order.order_date).toLocaleDateString()}<br />
                      {new Date(order.order_date).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {order.order_type_name}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        background: statusColor.bg,
                        color: statusColor.text
                      }}>
                        {order.status_name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {order.location_name}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                      ₱ {parseFloat(order.total).toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      {order.payment_method_name}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(order)}
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
                          onClick={() => handleDelete(order.id)}
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
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              {editingOrder ? 'Edit Order' : 'Create New Order'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Customer *
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
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
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.full_name} - {customer.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    User *
                  </label>
                  <select
                    name="user_id"
                    value={formData.user_id}
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
                    <option value="">Select User</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Order Date *
                  </label>
                  <input
                    type="datetime-local"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Shipping Address
                  </label>
                  <input
                    type="text"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="123 Street Name, City"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Billing Address
                  </label>
                  <input
                    type="text"
                    name="billing_address"
                    value={formData.billing_address}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="123 Street Name, City"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Status *
                  </label>
                  <select
                    name="status_id"
                    value={formData.status_id}
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
                    <option value="">Select Status</option>
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Order Type *
                  </label>
                  <select
                    name="order_type_id"
                    value={formData.order_type_id}
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
                    <option value="">Select Type</option>
                    {orderTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
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
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Subtotal *
                  </label>
                  <input
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Tax (%)
                  </label>
                  <input
                    type="number"
                    name="tax_percentage"
                    value={formData.tax_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    name="tax_amount"
                    value={formData.tax_amount}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: '#f9fafb'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Total
                  </label>
                  <input
                    type="number"
                    name="total"
                    value={formData.total}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      background: '#f9fafb',
                      fontWeight: '600'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
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
                    <option value="">Select Role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Payment Method *
                  </label>
                  <select
                    name="payment_method_id"
                    value={formData.payment_method_id}
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
                    <option value="">Select Payment</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                </div>
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
                  {editingOrder ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;