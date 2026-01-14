import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiEndpoints } from '../services/api'; 
import './styles/checkout.css';

import { TbUserPlus, TbCirclePlus, TbCash, TbQrcode, TbCreditCard } from 'react-icons/tb';
import { HiDotsHorizontal } from "react-icons/hi";

export const useCheckout = () => {
  // --- STATE ---
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Discount ---
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState(0);

  // Special Flags
  const [isSenior, setIsSenior] = useState(false);
  const [isPWD, setIsPWD] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  // --- LOGIC: Add Item to Cart ---
  const addToCart = (item) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.item_id === item.item_id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.item_id === item.item_id
           ? {...cartItem, quantity: cartItem.quantity + 1}
           : cartItem
        );
      } else {
        return [...prevCart, {
          id: item.id,
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price || 0,
          quantity: 1
        }];
      }
    });
  };

  // --- LOGIC: Remove Item ---
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // --- LOGIC: Update Quantity ---
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  // --- LOGIC: Clear Cart ---
  const clearCart = () => {
    setCartItems([]);
    setDiscountValue(0);
    setIsSenior(false);
    setIsPWD(false);
    setOrderNote('');
  };

  // --- LOGIC: Calculate Totals ---
  const calculateTotals = () => {
    const TAX_RATE = 0.12;
    const isSpecialDiscount = isSenior || isPWD;

    // 1. Create a new array with the tax/total calculated for EACH item
    const itemsWithTax = cartItems.map(item => {
      const grossAmount = item.price * item.quantity;
      let lineSubtotal, lineTax, lineDiscount, lineTotal;

      // VAT Exempt / Discount Logic
      if (isSpecialDiscount) {
        // SC/PWD: VAT Exemption (Price / 1.12)
        const vatExemptAmount = grossAmount / (1 + TAX_RATE);
        // 20% Discount on the VAT Exempt Amount
        const specialDiscountAmount = vatExemptAmount * 0.20;

        lineSubtotal = vatExemptAmount; 
        lineTax = 0;
        lineDiscount = specialDiscountAmount;
        lineTotal = vatExemptAmount - specialDiscountAmount;
      } else {
        // Regular: Logic updated to assume VAT INCLUSIVE pricing (Standard PH POS)
        // If price is 112, Tax is 12, Net is 100.
        
        // Calculate Discount
        if (discountType === 'PERCENTAGE') {
          lineDiscount = grossAmount * (discountValue / 100);
        } else {
          // Prorate fixed amount
          const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0); 
          lineDiscount = (discountValue / totalItems) * item.quantity;
        }

        const netAfterDiscount = grossAmount - lineDiscount;
        
        // Extract Tax from the discounted amount
        // Formula: Amount - (Amount / 1.12)
        const vatableAmount = netAfterDiscount / (1 + TAX_RATE);
        lineTax = netAfterDiscount - vatableAmount;
        
        lineSubtotal = vatableAmount; // Net of Tax
        lineTotal = netAfterDiscount; // Gross Total to pay
      }

      return {
        ...item,       
        lineSubtotal,  
        lineTax,
        lineDiscount,       
        lineTotal      
      };
    });

    const subtotal = itemsWithTax.reduce((acc, item) => acc + item.lineSubtotal, 0);
    const tax = itemsWithTax.reduce((acc, item) => acc + item.lineTax, 0);
    const totalDiscount = itemsWithTax.reduce((acc, item) => acc + item.lineDiscount, 0)
    const total = itemsWithTax.reduce((acc, item) => acc + item.lineTotal, 0);

    return { subtotal, tax, discount: totalDiscount, total, itemsWithTax };
  };

  // --- LOGIC: Process Checkout ---
  // UPDATED: Accepts an 'options' object to override flags (isSenior/PWD) 
  // because navigation state doesn't persist to hook state automatically.
  const processCheckout = async (itemsOverride, totalsOverride, note, options = {}) => {
    const itemsToProcess = itemsOverride || cartItems;

    if (itemsToProcess.length === 0) {
      alert("Cart is empty!");
      return;
    };
    
    // Determine flags: Use options if passed, otherwise use hook state
    const useSenior = options.isSenior !== undefined ? options.isSenior : isSenior;
    const usePWD = options.isPWD !== undefined ? options.isPWD : isPWD;

    setIsProcessing(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentTotals = totalsOverride || calculateTotals();

    const orderPayload = {
      user_id: currentUser.id || 300,
      customer_id: 1,
      status_id: 1,
      order_type_id: orderType,
      // Fix: Use the local variable calculated above, not the hook state directly
      tax_percentage: useSenior || usePWD ? 0 : 0.12, 
      tax_amount: currentTotals.tax,
      subtotal: currentTotals.subtotal,
      discount_amount: currentTotals.discount,
      isSenior: useSenior,
      isPWD: usePWD,
      total: currentTotals.total,
      role_id: currentUser.role_id || 1,
      location_id: currentUser.location_id || 15,
      shipping_address: currentUser.location_name || null,
      billing_address: currentUser.location_name || null,
      payment_method_id: 1,
      card_network_id: null,
      created_by: currentUser.id || 1,
      memo: note || null,
      items: itemsToProcess.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity,
        rate: item.price,
        tax_percentage: 0.12, // This might need to be dynamic based on Senior status, but usually stays 0.12 for record
        tax_amount: (item.lineTax || 0), // Use calculated line tax
        amount: (item.lineTotal || item.price * item.quantity)
      }))
    };

    try {
      const response = await apiEndpoints.orders.create(orderPayload);
      if (response.status === 201 || response.status === 200) {
        alert(`Order Created ID: ${response.data.orderid || 'New'}`);
        clearCart();
        return true; 
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to create order.");
      return false; 
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    cartItems,
    orderType,
    isProcessing,
    discountType, setDiscountType,
    discountValue, setDiscountValue,
    isSenior, setIsSenior,
    isPWD, setIsPWD,
    orderNote, setOrderNote,
    setOrderType,
    addToCart,
    removeItem,
    updateQuantity,
    clearCart,
    calculateTotals,
    processCheckout
  };
};

// --- COMPONENT ---
const Checkout = () => {
    const { processCheckout } = useCheckout();
    const location = useLocation();
    
    // Safely retrieve state with defaults
    const { 
      cartItems = [], 
      totals = {subtotal: 0, tax: 0, total: 0}, 
      orderNote = "",
      isSenior = false, // Retrieve these flags
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

    return(
      <div className='checkout-container'>
        {/* LEFT PANEL */}
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
                    <div className='item-price'>{formatCurrency(item.price * item.quantity)}</div>
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

        {/* RIGHT PANEL */}
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
                    {/* Updated Button onClick */}
                    <button 
                      className='exact-btn'
                      onClick={handlePayment} 
                    >
                        Exact
                    </button>
                </div>

                {/* Quick Amounts - wired up for UX */}
                <div className='quick-amounts-row'>
                    <input 
                        type="text" 
                        className='quick-amount-input' 
                        placeholder='XXXX.XX' 
                    />
                    <input 
                        type="text" 
                        className='quick-amount-input' 
                        placeholder='XXXX.XX' 
                    />
                    <input 
                        type="text" 
                        className='quick-amount-input' 
                        placeholder='XXXX.XX' 
                    />
                </div>

                {/* Payment Methods */}
                <div className='payment-methods-stack'>
                    <button className='payment-method-btn' onClick={handlePayment}>
                        <TbQrcode size={28} className='method-icon'/>
                        <span>QRPh</span>
                    </button>
                    <button className='payment-method-btn' onClick={handlePayment}>
                        <TbCreditCard size={28} className='method-icon'/>
                        <span>Credit Card</span>
                    </button>
                    <button className='payment-method-btn' onClick={handlePayment}>
                        <TbCreditCard size={28} className='method-icon'/>
                        <span>Debit Card</span>
                    </button>
                    <button className='payment-method-btn' onClick={handlePayment}>
                        <HiDotsHorizontal size={28} className='method-icon'/>
                        <span>Other</span>
                    </button>
                </div>
            </div>
        </div>
      </div>
    ); 
};

export default Checkout;