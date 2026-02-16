import React from 'react';

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

const OrdersTable = ({ orders, onEdit, onDelete }) => {
  return (
    <div className="orders-table-scroll">
      <table className="orders-table">
        <thead className="orders-thead">
          <tr>
            <th className="orders-th orders-th-narrow">Order ID</th>
            <th className="orders-th">Customer</th>
            <th className="orders-th">User</th>
            <th className="orders-th">Date/Time</th>
            <th className="orders-th">Type</th>
            <th className="orders-th">Status</th>
            <th className="orders-th">Location</th>
            <th className="orders-th">Total</th>
            <th className="orders-th">Payment</th>
            <th className="orders-th orders-th-wide">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const statusColor = getStatusColor(order.status_name);
            return (
              <tr key={order.id} className="orders-tr">
                <td className="orders-td orders-font-medium orders-text-muted">
                  #{order.id}
                </td>
                <td className="orders-td">
                  <div>
                    <div className="orders-font-medium orders-text-dark">{order.customer_name}</div>
                    <div className="orders-text-sm orders-text-muted">ID: {order.customer_id}</div>
                  </div>
                </td>
                <td className="orders-td">
                  <div>
                    <div className="orders-font-medium orders-text-dark">{order.user_name}</div>
                    <div className="orders-text-sm orders-text-muted">ID: {order.user_id}</div>
                  </div>
                </td>
                <td className="orders-td orders-text-muted orders-text-sm">
                  {new Date(order.order_date).toLocaleDateString()}<br />
                  {new Date(order.order_date).toLocaleTimeString()}
                </td>
                <td className="orders-td orders-text-muted">{order.order_type_name}</td>
                <td className="orders-td">
                  <span className="orders-status-badge" style={{ background: statusColor.bg, color: statusColor.text }}>
                    {order.status_name}
                  </span>
                </td>
                <td className="orders-td orders-text-muted">{order.location_name}</td>
                <td className="orders-td orders-font-medium orders-text-dark">
                  ₱ {parseFloat(order.total).toFixed(2)}
                </td>
                <td className="orders-td orders-text-muted">{order.payment_method_name}</td>
                <td className="orders-td">
                  <div className="orders-action-group">
                    <button onClick={() => onEdit(order)} className="orders-btn-primary">Edit</button>
                    <button onClick={() => onDelete(order.id)} className="orders-btn-danger">Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;