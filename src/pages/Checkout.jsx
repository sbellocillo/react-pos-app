import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiEndpoints } from '../services/api'; 
import './styles/checkout.css'

import { TbUserPlus, TbCirclePlus } from 'react-icons/tb';

export const useCheckout = () => {
  // --- STATE ---
  // - Extracted state initialization for cart, order type, and processing status
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- LOGIC: Add Item to Cart ---
  // - Extracted handleAddToCart logic
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
  // - Extracted handleRemoveItem logic
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // --- LOGIC: Update Quantity ---
  // - Extracted handleUpdateQuantity logic
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  // --- LOGIC: Clear Cart ---
  // - Referenced in handleOPtionClick for 'newOrder' and 'cancelOrder'
  const clearCart = () => {
    setCartItems([]);
  };

  // --- LOGIC: Calculate Totals ---
  // - Extracted calculateTotals logic
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = 0.12;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // --- LOGIC: Process Checkout ---
  // - Extracted handleCheckout logic including API call and payload construction
  const processCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const totals = calculateTotals();

    const orderPayload = {
      customer_id: 1,
      status_id: 1,
      order_type_id: orderType,
      tax_percentage: 0.12,
      tax_amount: totals.tax,
      subtotal: totals.subtotal,
      total: totals.total,
      role_id: currentUser.role_id || 1,
      location_id: currentUser.location_id || 15,
      payment_method_id: 1,
      card_network_id: null,
      created_by: currentUser.id || 1,
      items: cartItems.map(item => ({
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
        return true; // Indicate success
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to create order.");
      return false; // Indicate failure
    } finally {
      setIsProcessing(false);
    }
  };

  // Return state and handlers needed by the UI
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

// Default export if you still want to treat this file as a component file, 
// though strictly speaking it is now a hook provider.
const Checkout = () => {
    
    const location = useLocation();
    const { cartItems, totals } = location.state || {
        cartItems: [],
        totals: {subtotal: 0, tax: 0, total: 0}
    };

    const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;
    return(
        <div className='checkout-container'>
     <div className='left-panel'>
        
        {/* --- SECTION 1: HEADER BUTTON --- */}
        <button className='add-user-btn'>
            <div className='btn-content-left'>
                <TbUserPlus size={26} />
                <span className='btn-text'>Add Customer</span>
            </div>
            <TbCirclePlus size={26} />
        </button>

        {/* --- SECTION 2: SCROLLABLE LIST --- */}
        <div className='checkout-items-list'>
           {cartItems.length > 0 ? (
             cartItems.map((item, index) => (
               <div className='checkout-item-row' key={index}>
                 {/* Fixed width for quantity to align perfectly */}
                 <div className='item-qty'>{item.quantity}</div> 
                 <div className='item-name'>{item.item_name}</div>
                 <div className='item-price'>{formatCurrency(item.price * item.quantity)}</div>
               </div>
             ))
           ) : (
             <div className='empty-message'>No items in cart</div>
           )}
        </div>

        {/* --- SECTION 3: FOOTER SUMMARY --- */}
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

     <div className='right-panel'>
        <div className='total-price-container'>
            <span className='total-price'>{formatCurrency(totals.total)}</span>
        </div>
     </div>
    </div>
    ); 
};

export default Checkout;