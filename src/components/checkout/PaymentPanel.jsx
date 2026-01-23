import React from 'react';
import { TbCash, TbQrcode, TbCreditCard } from 'react-icons/tb';
import { HiDotsHorizontal } from "react-icons/hi";

const PaymentPanel = ({ 
  totals, 
  cashReceived, 
  setCashReceived, 
  handlePayment, 
  formatCurrency 
}) => {
  return (
    <div className='right-panel'>
      <div className='total-price-container'>
        <span className='total-price'>{formatCurrency(totals.total)}</span>
      </div>

      <div className='payment-form-container'>
        {/* Cash Input */}
        <div className='cash-input-group'>
          <div className='cash-input-wrapper'>
            <TbCash className='input-icon' size={32} />
            <span className='input-label'>Cash</span>
            <input
              type='number'
              inputMode='decimal'
              step='0.01'
              className='custom-input'
              placeholder='0.00'
              value={cashReceived}
              onChange={(e) => setCashReceived(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <button className='exact-btn' onClick={handlePayment}>
            Exact
          </button>
        </div>

        {/* Quick Amounts */}
        <div className='quick-amounts-row'>
          <input type="text" className='quick-amount-input' placeholder='XXXX.XX' />
          <input type="text" className='quick-amount-input' placeholder='XXXX.XX' />
          <input type="text" className='quick-amount-input' placeholder='XXXX.XX' />
        </div>

        {/* Payment Methods */}
        <div className='payment-methods-stack'>
          <button className='payment-method-btn' onClick={handlePayment}>
            <TbQrcode size={28} className='method-icon' />
            <span>QRPh</span>
          </button>
          <button className='payment-method-btn' onClick={handlePayment}>
            <TbCreditCard size={28} className='method-icon' />
            <span>Credit Card</span>
          </button>
          <button className='payment-method-btn' onClick={handlePayment}>
            <TbCreditCard size={28} className='method-icon' />
            <span>Debit Card</span>
          </button>
          <button className='payment-method-btn' onClick={handlePayment}>
            <HiDotsHorizontal size={28} className='method-icon' />
            <span>Other</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPanel;