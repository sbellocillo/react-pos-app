import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import PaymentPanel from '../components/checkout/PaymentPanel';
import './styles/checkout.css';

const Checkout = () => {
  const { processCheckout } = useCheckout();
  const location = useLocation();

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
  const handlePayment = () => {
    // Pass the flags from location.state into the hook function
    processCheckout(cartItems, totals, orderNote, { isSenior, isPWD });
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
    </div>
  );
};

export default Checkout;