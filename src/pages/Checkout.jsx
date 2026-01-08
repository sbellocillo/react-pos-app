import { useState } from 'react';
import { apiEndpoints } from '../services/api'; // Ensure this path is correct relative to where you place this file

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
  return(
    <div>
        Checkout Page
    </div>
  ); 
};

export default Checkout;