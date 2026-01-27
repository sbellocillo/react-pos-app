import { useState } from 'react';
import { apiEndpoints } from '../services/api';

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
    // Constants
    const VAT_RATE = 0.12; 
    const isSpecialDiscount = isSenior || isPWD;
    
    const totalCartQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // 1. Process each item
    const itemsWithTax = cartItems.map(item => {
      const extendedBasePrice = item.price * item.quantity;
      
      let rowBase, rowTax, rowDiscount, rowPayable;

      if (isSpecialDiscount) {
        // Scenario A: Senior/PWD (VAT Exempt + 20% Discount)
        const seniorDiscountAmount = extendedBasePrice * 0.20;

        rowBase = extendedBasePrice;
        rowTax = 0; // Exempt
        rowDiscount = seniorDiscountAmount;
        rowPayable = extendedBasePrice - seniorDiscountAmount;
        
      } else {
        // Scenario B: Regular Customer (VAT Exclusive -> Add Tax)
        let calculatedDiscount = 0;
        if (discountType === 'PERCENTAGE') {
          calculatedDiscount = extendedBasePrice * (discountValue / 100);
        } else {
          // Prorate fixed amount
          calculatedDiscount = totalCartQuantity > 0 
            ? (discountValue / totalCartQuantity) * item.quantity 
            : 0;
        }
        
        const netBasePrice = extendedBasePrice - calculatedDiscount;
        const calculatedTax = netBasePrice * VAT_RATE;

        rowBase = extendedBasePrice;
        rowDiscount = calculatedDiscount;
        rowTax = calculatedTax;
        rowPayable = netBasePrice + calculatedTax;
      }

      return {
        ...item,       
        lineSubtotal: rowBase,
        lineTax: rowTax,
        lineDiscount: rowDiscount,
        lineTotal: rowPayable
      };
    });

    const subtotal = itemsWithTax.reduce((acc, item) => acc + item.lineSubtotal, 0);
    const totalTax = itemsWithTax.reduce((acc, item) => acc + item.lineTax, 0);
    const totalDiscount = itemsWithTax.reduce((acc, item) => acc + item.lineDiscount, 0);
    const total = itemsWithTax.reduce((acc, item) => acc + item.lineTotal, 0);

    return { subtotal, tax: totalTax, discount: totalDiscount, total, itemsWithTax };
  };

  // --- LOGIC: Process Checkout ---
  const processCheckout = async (itemsOverride, totalsOverride, note, options = {}) => {
    const itemsToProcess = itemsOverride || cartItems;

    if (itemsToProcess.length === 0) {
      alert("Cart is empty!");
      return;
    };
    
    // Determine flags: Use options if passed, otherwise use hook state
    const useOrderType = options.orderType !== undefined ? options.orderType : orderType;
    const useSenior = options.isSenior !== undefined ? options.isSenior : isSenior;
    const usePWD = options.isPWD !== undefined ? options.isPWD : isPWD;

    setIsProcessing(true);
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const currentTotals = totalsOverride || calculateTotals();

    const orderPayload = {
      user_id: currentUser.id || 300,
      customer_id: 1,
      status_id: 1,
      order_type_id: useOrderType,
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
        tax_percentage: 0.12, 
        tax_amount: (item.lineTax || 0), 
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