import React, { useState, useEffect } from 'react';

const OrdersModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingOrder,
  customers, 
  users, 
  statuses, 
  orderTypes, 
  locations, 
  roles, 
  paymentMethods 
}) => {
  const defaultFormState = {
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
  };

  const [formData, setFormData] = useState(defaultFormState);

  // Sync form data when the modal opens or the selected order changes
  useEffect(() => {
    if (editingOrder && isOpen) {
      setFormData({
        customer_id: editingOrder.customer_id?.toString() || '',
        user_id: editingOrder.user_id?.toString() || '',
        order_date: editingOrder.order_date ? editingOrder.order_date.slice(0, 16) : defaultFormState.order_date,
        shipping_address: editingOrder.shipping_address || '',
        billing_address: editingOrder.billing_address || '',
        status_id: editingOrder.status_id?.toString() || '',
        order_type_id: editingOrder.order_type_id?.toString() || '',
        subtotal: editingOrder.subtotal?.toString() || '',
        tax_percentage: editingOrder.tax_percentage ? (editingOrder.tax_percentage * 100).toFixed(2) : '12.00',
        tax_amount: editingOrder.tax_amount ? parseFloat(editingOrder.tax_amount).toFixed(2) : '0.00',
        total: editingOrder.total?.toString() || '',
        role_id: editingOrder.role_id?.toString() || '',
        location_id: editingOrder.location_id?.toString() || '',
        payment_method_id: editingOrder.payment_method_id?.toString() || '',
        is_active: editingOrder.is_active ?? true
      });
    } else if (!editingOrder && isOpen) {
      setFormData(defaultFormState);
    }
  }, [editingOrder, isOpen]);

  // Don't render anything if the modal is closed
  if (!isOpen) return null;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); 
  };

  return (
    <div className="orders-modal-overlay">
      <div className="orders-modal-content">
        <h3 className="orders-modal-title">
          {editingOrder ? 'Edit Order' : 'Create New Order'}
        </h3>

        <form onSubmit={handleSubmit}>
          
          {/* Customer & User */}
          <div className="orders-form-grid-2">
            <div>
              <label className="orders-form-label">Customer *</label>
              <select
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.full_name || customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="orders-form-label">User *</label>
              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="orders-form-control"
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

          {/* Order Date */}
          <div className="orders-form-grid-1">
            <div>
              <label className="orders-form-label">Order Date *</label>
              <input
                type="datetime-local"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
                required
                className="orders-form-control"
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="orders-form-grid-2">
            <div>
              <label className="orders-form-label">Shipping Address</label>
              <input
                type="text"
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                maxLength="500"
                placeholder="123 Street Name, City"
                className="orders-form-control"
              />
            </div>
            <div>
              <label className="orders-form-label">Billing Address</label>
              <input
                type="text"
                name="billing_address"
                value={formData.billing_address}
                onChange={handleChange}
                maxLength="500"
                placeholder="123 Street Name, City"
                className="orders-form-control"
              />
            </div>
          </div>

          {/* Status, Type, Location */}
          <div className="orders-form-grid-3">
            <div>
              <label className="orders-form-label">Status *</label>
              <select
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Status</option>
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="orders-form-label">Order Type *</label>
              <select
                name="order_type_id"
                value={formData.order_type_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Type</option>
                {orderTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="orders-form-label">Location *</label>
              <select
                name="location_id"
                value={formData.location_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>{location.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financials */}
          <div className="orders-form-grid-4">
            <div>
              <label className="orders-form-label">Subtotal *</label>
              <input
                type="number"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="orders-form-control"
              />
            </div>
            <div>
              <label className="orders-form-label">Tax (%)</label>
              <input
                type="number"
                name="tax_percentage"
                value={formData.tax_percentage}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="orders-form-control"
              />
            </div>
            <div>
              <label className="orders-form-label">Tax Amount</label>
              <input
                type="number"
                name="tax_amount"
                value={formData.tax_amount}
                readOnly
                className="orders-form-control orders-form-control-readonly"
              />
            </div>
            <div>
              <label className="orders-form-label">Total</label>
              <input
                type="number"
                name="total"
                value={formData.total}
                readOnly
                className="orders-form-control orders-form-control-total"
              />
            </div>
          </div>

          {/* Role & Payment Method */}
          <div className="orders-form-grid-2">
            <div>
              <label className="orders-form-label">Role *</label>
              <select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="orders-form-label">Payment Method *</label>
              <select
                name="payment_method_id"
                value={formData.payment_method_id}
                onChange={handleChange}
                required
                className="orders-form-control"
              >
                <option value="">Select Payment</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>{method.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Checkbox */}
          <div className="orders-checkbox-wrapper">
            <label className="orders-checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="orders-checkbox-input"
              />
              Active
            </label>
          </div>

          {/* Actions */}
          <div className="orders-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="orders-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="orders-btn-success"
            >
              {editingOrder ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrdersModal;