import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCheckout } from '../hooks/useCheckout';
import { apiEndpoints } from '../services/api';
import { Receipt } from '../components/checkout/Receipt';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import PaymentPanel from '../components/checkout/PaymentPanel';
import './styles/checkout.css';

const Checkout = () => {
  const { processCheckout } = useCheckout();
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = React.useRef();
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState(null);
  const [ terminalData, setTerminalData ] = useState(null);

  // Safely retrieve state with defaults from Router
  const {
    cartItems = [],
    totals = { subtotal: 0, tax: 0, total: 0 },
    orderNote = "",
    isSenior = false,
    isPWD = false,
    orderType = 1
  } = location.state || {};

  // Local state for Cash Input
  const [cashReceived, setCashReceived] = useState("");

  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;

  useEffect(() => {
    const fetchTerminalData = async () => {
      const currentPosId = localStorage.getItem('pos_terminal_number') || '1';

      try {
        const response = await apiEndpoints.posTerminals.getById(currentPosId);
        if (response.data && response.data.success) {
          setTerminalData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load terminal settings:", error);
      }
    };

    fetchTerminalData();
  },[]);

  // Helper to trigger checkout with the correct Context
  const handlePayment =  async () => {
    // Pass the flags from location.state into the hook function
    const result = await processCheckout(cartItems, totals, orderNote, { isSenior, isPWD, orderType });

    if (result && result.success) {
      setGeneratedOrderNumber(result.orderNumber);
      setTimeout(() => {
        window.print();
        navigate('/dashboard');
      }, 500);
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
        orderNumber={generatedOrderNumber}
        date={new Date().toLocaleString()}
        terminalData={terminalData}
        cashReceived={cashReceived}
      />
    </div>
  );
};

export default Checkout;