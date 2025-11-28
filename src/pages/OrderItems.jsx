import { useState, useEffect } from 'react';
import axios from 'axios';

const OrderItems = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOrderItem, setEditingOrderItem] = useState(null);
  const [formData, setFormData] = useState({
    order_id: '',
    item_id: '',
    status_id: '',
    quantity: '1',
    rate: '',
    subtotal: '0.00',
    tax_percentage: '12.00',
    tax_amount: '0.00',
    amount: '0.00',
    is_active: true
  });

  // Sample data for dropdowns
  const sampleOrders = [
    { id: 1, customer_id: 1001, total: 952.00 },
    { id: 2, customer_id: 1002, total: 728.00 },
    { id: 3, customer_id: 1003, total: 1344.00 }
  ];

  const sampleItems = [
    { id: 1, name: 'BBQ Ribs', price: 450.00 },
    { id: 2, name: 'Grilled Chicken', price: 350.00 },
    { id: 3, name: 'Pork Sisig', price: 280.00 },
    { id: 4, name: 'Beef Brisket', price: 520.00 },
    { id: 5, name: 'Iced Tea', price: 45.00 }
  ];

  const sampleStatuses = [
    { id: 1, name: 'Pending' },
    { id: 2, name: 'Confirmed' },
    { id: 3, name: 'Preparing' },
    { id: 4, name: 'Ready' },
    { id: 5, name: 'Served' }
  ];

  // Sample order items data
  const sampleOrderItems = [
    {
      id: 1,
      order_id: 1,
      order_customer: 1001,
      item_id: 1,
      item_name: 'BBQ Ribs',
      status_id: 3,
      status_name: 'Preparing',
      quantity: 1.00,
      rate: 450.00,
      subtotal: 450.00,
      tax_percentage: 0.1200,
      tax_amount: 54.00,
      amount: 504.00,
      is_active: true
    },
    {
      id: 2,
      order_id: 1,
      order_customer: 1001,
      item_id: 2,
      item_name: 'Grilled Chicken',
      status_id: 3,
      status_name: 'Preparing',
      quantity: 1.00,
      rate: 350.00,
      subtotal: 350.00,
      tax_percentage: 0.1200,
      tax_amount: 42.00,
      amount: 392.00,
      is_active: true
    },
    {
      id: 3,
      order_id: 1,
      order_customer: 1001,
      item_id: 5,
      item_name: 'Iced Tea',
      status_id: 4,
      status_name: 'Ready',
      quantity: 2.00,
      rate: 45.00,
      subtotal: 90.00,
      tax_percentage: 0.1200,
      tax_amount: 10.80,
      amount: 100.80,
      is_active: true
    },
    {
      id: 4,
      order_id: 2,
      order_customer: 1002,
      item_id: 3,
      item_name: 'Pork Sisig',
      status_id: 5,
      status_name: 'Served',
      quantity: 2.00,
      rate: 280.00,
      subtotal: 560.00,
      tax_percentage: 0.1200,
      tax_amount: 67.20,
      amount: 627.20,
      is_active: true
    },
    {
      id: 5,
      order_id: 3,
      order_customer: 1003,
      item_id: 4,
      item_name: 'Beef Brisket',
      status_id: 2,
      status_name: 'Confirmed',
      quantity: 2.00,
      rate: 520.00,
      subtotal: 1040.00,
      tax_percentage: 0.1200,
      tax_amount: 124.80,
      amount: 1164.80,
      is_active: true
    }
  ];

  useEffect(() => {
    setOrderItems(sampleOrderItems);
    setOrders(sampleOrders);
    setItems(sampleItems);
    setStatuses(sampleStatuses);
  }, []);

  const resetForm = () => {
    setFormData({
      order_id: '',
      item_id: '',
      status_id: '',
      quantity: '1',
      rate: '',
      subtotal: '0.00',
      tax_percentage: '12.00',
      tax_amount: '0.00',
      amount: '0.00',
      is_active: true
    });
  };

  const calculateAmounts = (quantity, rate, taxPercentage) => {
    const qty = parseFloat(quantity) || 0;
    const rateNum = parseFloat(rate) || 0;
    const taxRate = parseFloat(taxPercentage) / 100 || 0;

    const subtotal = qty * rateNum;
    const taxAmount = subtotal * taxRate;
    const amount = subtotal + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      tax_amount: taxAmount.toFixed(2),
      amount: amount.toFixed(2)
    };
  };

  const handleCreate = () => {
    setEditingOrderItem(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (orderItem) => {
    setEditingOrderItem(orderItem);
    setFormData({
      order_id: orderItem.order_id?.toString() || '',
      item_id: orderItem.item_id?.toString() || '',
      status_id: orderItem.status_id?.toString() || '',
      quantity: orderItem.quantity?.toString() || '1',
      rate: orderItem.rate?.toString() || '',
      subtotal: orderItem.subtotal?.toFixed(2) || '0.00',
      tax_percentage: (orderItem.tax_percentage * 100).toFixed(2),
      tax_amount: orderItem.tax_amount?.toFixed(2) || '0.00',
      amount: orderItem.amount?.toFixed(2) || '0.00',
      is_active: orderItem.is_active
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.order_id || !formData.item_id || !formData.quantity ||
      !formData.rate || !formData.status_id) {
      alert('Please fill in all required fields');
      return;
    }

    const calculations = calculateAmounts(formData.quantity, formData.rate, formData.tax_percentage);

    const orderItemData = {
      order_id: parseInt(formData.order_id),
      order_customer: orders.find(o => o.id === parseInt(formData.order_id))?.customer_id || '',
      item_id: parseInt(formData.item_id),
      item_name: items.find(i => i.id === parseInt(formData.item_id))?.name || '',
      status_id: parseInt(formData.status_id),
      status_name: statuses.find(s => s.id === parseInt(formData.status_id))?.name || '',
      quantity: parseFloat(formData.quantity),
      rate: parseFloat(formData.rate),
      subtotal: parseFloat(calculations.subtotal),
      tax_percentage: parseFloat(formData.tax_percentage) / 100,
      tax_amount: parseFloat(calculations.tax_amount),
      amount: parseFloat(calculations.amount),
      is_active: formData.is_active
    };

    if (editingOrderItem) {
      setOrderItems(orderItems.map(oi =>
        oi.id === editingOrderItem.id
          ? { ...orderItemData, id: editingOrderItem.id }
          : oi
      ));
    } else {
      const newOrderItem = {
        ...orderItemData,
        id: Math.max(...orderItems.map(oi => oi.id), 0) + 1
      };
      setOrderItems([...orderItems, newOrderItem]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order item?')) {
      setOrderItems(orderItems.filter(oi => oi.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFormData = {
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Auto-fill rate when item is selected
    if (name === 'item_id' && value) {
      const selectedItem = items.find(item => item.id === parseInt(value));
      if (selectedItem) {
        newFormData.rate = selectedItem.price.toString();
      }
    }

    // Auto-calculate amounts when quantity, rate, or tax percentage changes
    if (name === 'quantity' || name === 'rate' || name === 'tax_percentage' ||
      (name === 'item_id' && value)) {
      const calculations = calculateAmounts(
        name === 'quantity' ? value : newFormData.quantity,
        name === 'rate' ? value : newFormData.rate,
        name === 'tax_percentage' ? value : newFormData.tax_percentage
      );
      newFormData = {
        ...newFormData,
        subtotal: calculations.subtotal,
        tax_amount: calculations.tax_amount,
        amount: calculations.amount
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
      'served': { bg: '#f0fdf4', text: '#15803d' }
    };
    return colors[statusName?.toLowerCase()] || { bg: '#f3f4f6', text: '#374151' };
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Order Items Management</h2>
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
          Add Order Item
        </button>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        height: '650px'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1100px' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', width: '80px' }}>
                  ID
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Order
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Item
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Status
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Quantity
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Rate
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Subtotal
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Tax
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                  Amount
                </th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb', width: '200px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((orderItem) => {
                const statusColor = getStatusColor(orderItem.status_name);
                return (
                  <tr key={orderItem.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#6b7280' }}>
                      #{orderItem.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '500', color: '#1e293b' }}>
                          Order #{orderItem.order_id}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Customer #{orderItem.order_customer}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                      {orderItem.item_name}
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
                        {orderItem.status_name}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                      {orderItem.quantity}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      ₱{orderItem.rate.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      ₱{orderItem.subtotal.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>
                      ₱{orderItem.tax_amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#1e293b' }}>
                      ₱{orderItem.amount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleEdit(orderItem)}
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
                          onClick={() => handleDelete(orderItem.id)}
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>
              {editingOrderItem ? 'Edit Order Item' : 'Add New Order Item'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Order *
                  </label>
                  <select
                    name="order_id"
                    value={formData.order_id}
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
                    <option value="">Select Order</option>
                    {orders.map(order => (
                      <option key={order.id} value={order.id}>
                        Order #{order.id} - Customer #{order.customer_id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Item *
                  </label>
                  <select
                    name="item_id"
                    value={formData.item_id}
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
                    <option value="">Select Item</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} - ₱{item.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="0.01"
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Rate *
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleChange}
                    required
                    min="0"
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
                    Tax Percentage (%)
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    Subtotal
                  </label>
                  <input
                    type="number"
                    name="subtotal"
                    value={formData.subtotal}
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
                    Total Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
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
                  {editingOrderItem ? 'Update' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderItems;