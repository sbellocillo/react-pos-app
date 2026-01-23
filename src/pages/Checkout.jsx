import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import { Receipt } from '../components/checkout/Receipt';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import PaymentPanel from '../components/checkout/PaymentPanel';
import './styles/checkout.css';

const Checkout = () => {
  const { processCheckout } = useCheckout();
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = React.useRef();

  // Safely retrieve state with defaults from Router
  const {
    cartItems = [],
    totals = { subtotal: 0, tax: 0, total: 0 },
    orderNote = "",
    isSenior = false,
    isPWD = false
  } = location.state || {};

  // Local state for Cash Input
  const [cashReceived, setCashReceived] = useState("");

  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;

  // Helper to trigger checkout with the correct Context
  const handlePayment =  async () => {
    // Pass the flags from location.state into the hook function
    const success = await processCheckout(cartItems, totals, orderNote, { isSenior, isPWD });

    if (success) {
      window.print();
      navigate('/dashboard');
    }
  };

  return (
    <div className='checkout-container'>
      {/* Left Panel: Summary */}
      <CheckoutSummary 
        cartItems={cartItems} 
        totals={totals} 
        formatCurrency={formatCurrency} 
      />

      {/* Right Panel: Payment Actions */}
      <PaymentPanel 
        totals={totals}
        cashReceived={cashReceived}
        setCashReceived={setCashReceived}
        handlePayment={handlePayment}
        formatCurrency={formatCurrency}
      />

      {/* Receipt */}
      <Receipt
        ref={receiptRef}
        cartItems={cartItems}
        totals={totals}
        orderNumber="XXX"
        date={new Date().toLocaleString()}
      />
    </div>
  );
};

export default Checkout;