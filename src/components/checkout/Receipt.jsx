import React from 'react';
import './styles/Receipt.css'; // Dedicated CSS for printing

// Use forwardRef so the print function can "target" this component
export const Receipt = React.forwardRef(({ cartItems, totals, orderNumber, date }, ref) => {
  return (
    <div ref={ref} className="receipt-container">
      {/* Header */}
      <div className="receipt-header">
        <h2 className="store-name">RIBSHACK</h2>
        <div className="receipt-meta">
          <p>{date}</p>
          <p>Order #: {orderNumber}</p>
        </div>
      </div>

      {/* Items */}
      <div className="receipt-items">
        <div className="row">
            <span>QTY ITEM</span>
            <span>TOTAL</span>
        </div>
        {cartItems.map((item, index) => (
          <div key={index} className="receipt-item-row">
            <span className="qty">{item.quantity}x</span>
            <span className="name">{item.item_name}</span>
            <span className="price">{Number(item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="receipt-footer">
        <div className="row">
            <span>Subtotal</span>
            <span>{Number(totals.subtotal).toFixed(2)}</span>
        </div>
        <div className="row">
            <span>Cash Tendered</span>
            <span></span>
        </div>
        <div className="row">
            <span>Change</span>
            <span></span>
        </div>

         <div className="row section">
            <span>Vatable Sales</span>
            <span>{Number(totals.tax).toFixed(2)}</span>
        </div>
        <div className="row">
            <span>VAT</span>
            <span>{Number(totals.tax).toFixed(2)}</span>
        </div>
        
        <div className="row total">
            <span>TOTAL</span>
            <span>{Number(totals.total).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="receipt-thank-you">Thank you for dining with us!</div>
    </div>
  );
});