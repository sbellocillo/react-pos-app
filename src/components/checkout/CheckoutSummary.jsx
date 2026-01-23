import React from 'react';
import { TbUserPlus, TbCirclePlus } from 'react-icons/tb';

const CheckoutSummary = ({ cartItems, totals, formatCurrency }) => {
  return (
    <div className='left-panel'>
      <button className='add-user-btn'>
        <div className='btn-content-left'>
          <TbUserPlus size={26} />
          <span className='btn-text'>Add Customer</span>
        </div>
        <TbCirclePlus size={26} />
      </button>

      <div className='checkout-items-list'>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className='checkout-item-row' key={index}>
              <div className='item-qty'>{item.quantity}</div>
              <div className='item-name'>{item.item_name}</div>
              <div className='item-price'>
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          ))
        ) : (
          <div className='empty-message'>No items in cart</div>
        )}
      </div>

      <div className='checkout-footer'>
        <div className='summary-row'>
          <span>Sub-Total</span>
          <span className='summary-value'>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className='summary-row'>
          <span>Discount</span>
          <span className='summary-value'>{formatCurrency(totals.discount || 0)}</span>
        </div>
        <div className='summary-row'>
          <span>Tax</span>
          <span className='summary-value'>{formatCurrency(totals.tax)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;