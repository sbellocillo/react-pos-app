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
  };

  // --- LOGIC: Calculate Totals ---
  const calculateTotals = () => {
    const taxRate = 0.12;

    // 1. Create a new array with the tax/total calculated for EACH item
    const itemsWithTax = cartItems.map(item => {
      const lineSubtotal = item.price * item.quantity;
      const lineTax = lineSubtotal * taxRate;
      const lineTotal = lineSubtotal + lineTax;

      return {
        ...item,       
        lineSubtotal,  
        lineTax,       
        lineTotal      
      };
    });

    // Console logs for debugging
    if (itemsWithTax.length > 0) {
      console.group("🧾 Itemized Tax Breakdown");
      itemsWithTax.forEach(item => {
        console.log(`📦 Item: ${item.item_name} (Qty: ${item.quantity})`);
        console.log(`   Subtotal: ₱${item.lineSubtotal.toFixed(2)}`);
        console.log(`   Tax:      ₱${item.lineTax.toFixed(2)}`);
        console.log(`   Total:    ₱${item.lineTotal.toFixed(2)}`);
        console.log("   ----------------");
      });
      console.groupEnd();
    }

    // 2. Sum up the results
    const subtotal = itemsWithTax.reduce((acc, item) => acc + item.lineSubtotal, 0);
    const tax = itemsWithTax.reduce((acc, item) => acc + item.lineTax, 0);
    const total = itemsWithTax.reduce((acc, item) => acc + item.lineTotal, 0);

    return { 
      subtotal, 
      tax, 
      total, 
      itemsWithTax 
    };
  };

  // --- LOGIC: Process Checkout ---
  const processCheckout = async (itemsOverride, totalsOverride, note) => {
    const itemsToProcess = itemsOverride || cartItems;

    if (itemsToProcess.length === 0) {
      alert("Cart is empty!");
      return;
    };
    
    setIsProcessing(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentTotals = totalsOverride || calculateTotals();

    const orderPayload = {
      user_id: currentUser.id || 300,
      customer_id: 1,
      status_id: 1,
      order_type_id: orderType,
      tax_percentage: 0.12,
      tax_amount: currentTotals.tax,
      subtotal: currentTotals.subtotal,
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
        tax_percentage: 0.12,
        tax_amount: (item.price * item.quantity) * 0.12,
        amount: (item.price * item.quantity)
      }))
    };

    try {
      const response = await apiEndpoints.orders.create(orderPayload);
      if (response.status === 201 || response.status === 200) {
        alert(`Order Created ID: ${response.data.orderid || 'New'}`);
        setCartItems([]);
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
    const { cartItems, totals, orderNote } = location.state || {
        cartItems: [],
        totals: {subtotal: 0, tax: 0, total: 0},
        orderNote: ""
    };

    const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;

    return(
      <div className='checkout-container'>
        
        {/* --- LEFT PANEL --- */}
        <div className='left-panel'>
            
            {/* Header Button */}
            <button className='add-user-btn'>
                <div className='btn-content-left'>
                    <TbUserPlus size={26} />
                    <span className='btn-text'>Add Customer</span>
                </div>
                <TbCirclePlus size={26} />
            </button>

            {/* Scrollable List */}
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

            {/* Footer Summary */}
            <div className='checkout-footer'>
              <div className='summary-row'>
                <span>Sub-Total</span>
                <span className='summary-value'>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className='summary-row'>
                <span>Discount</span>
                <span className='summary-value'>{formatCurrency(0)}</span>
              </div>
              <div className='summary-row'>
                <span>Tax</span>
                <span className='summary-value'>{formatCurrency(totals.tax)}</span>
              </div>
            </div>
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className='right-panel'>
            <div className='total-price-container'>
                <span className='total-price'>{formatCurrency(totals.total)}</span>
            </div>

            {/* Payment Form Wrapper */}
            <div className='payment-form-container'>
                
                {/* SECTION A: Cash Input Row */}
                <div className='cash-input-group'>
                    <div className='cash-input-wrapper'>
                        <TbCash className='input-icon' size={32} />
                        <span className='input-label'>Cash</span>
                        <input 
                            type='text' 
                            className='custom-input' 
                            placeholder='XXXX.XX' 
                        />
                    </div>
                    <button 
                      className='exact-btn'
                      onClick={() => {processCheckout(cartItems, totals, orderNote)}}
                    >
                        Exact
                    </button>
                </div>

                {/* SECTION B: Quick Amount Inputs */}
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

                {/* SECTION C: Payment Methods Stack */}
                <div className='payment-methods-stack'>
                    <button className='payment-method-btn'>
                        <TbQrcode size={28} className='method-icon'/>
                        <span>QRPh</span>
                    </button>
                    
                    <button className='payment-method-btn'>
                        <TbCreditCard size={48} className='method-icon'/>
                        <span>Credit Card</span>
                    </button>
                    
                    <button className='payment-method-btn'>
                        <TbCreditCard size={48} className='method-icon'/>
                        <span>Debit Card</span>
                    </button>

                    <button className='payment-method-btn'>
                        <HiDotsHorizontal size={48} className='method-icon'/>
                        <span>Other</span>
                    </button>
                </div>

            </div>
        </div>
      </div>
    ); 
};

export default Checkout;