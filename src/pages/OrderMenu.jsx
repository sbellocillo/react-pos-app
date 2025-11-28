import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiEndpoints } from '../services/api';

const OrderMenu = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'completed', 'dineIn', 'takeOut'

  const [customers, setCustomers] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback data for customers
  const fallbackCustomers = [
    { id: 1, name: 'Emma Wang' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Jane Smith' },
    { id: 4, name: 'Mike Johnson' },
    { id: 5, name: 'Sarah Wilson' },
    { id: 6, name: 'David Brown' }
  ];

  // Fallback data for payment methods
  const fallbackPaymentMethods = [
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Debit Card' },
    { id: 4, name: 'GCash' },
    { id: 5, name: 'Maya' },
    { id: 6, name: 'Bank Transfer' }
  ];

  // Fallback data for order types
  // const orderTypes = [
  //   { id: 1, name: 'Dine In' },
  //   { id: 2, name: 'Take Out' },
  //   { id: 3, name: 'Delivery' }
  // ];

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Emma Wang',
      type: 'completed',
      items: ['BBQ Ribs', 'Coca Cola'],
      total: 1399.99, // Updated to peso pricing
      paymentMethod: 'Cash',
      discount: 'PWD',
      memo: 'Extra sauce on the side',
      time: '2:30 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-002',
      customer: 'John Doe',
      type: 'dineIn',
      items: ['Buffalo Wings', 'Coffee'],
      total: 774.49, // Updated to peso pricing
      paymentMethod: 'Credit Card',
      discount: '',
      memo: 'Table 5, no onions',
      time: '3:15 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-003',
      customer: 'Jane Smith',
      type: 'takeOut',
      items: ['Chocolate Cake', 'Fresh Orange Juice'],
      total: 648.98, // Updated to peso pricing
      paymentMethod: 'GCash',
      discount: 'Senior',
      memo: 'Birthday cake, add candles',
      time: '1:45 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-004',
      customer: 'Mike Johnson',
      type: 'completed',
      items: ['Grilled Chicken', 'Iced Tea'],
      total: 1087.74, // Updated to peso pricing
      paymentMethod: 'Debit Card',
      discount: '',
      memo: '',
      time: '12:30 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-005',
      customer: 'Sarah Wilson',
      type: 'dineIn',
      items: ['Seasonal Salad', 'Sparkling Water'],
      total: 862.24, // Updated to peso pricing
      paymentMethod: 'Maya',
      discount: '',
      memo: 'Allergy: nuts, gluten-free',
      time: '2:00 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-006',
      customer: 'David Brown',
      type: 'takeOut',
      items: ['Fish & Chips', 'Lemonade'],
      total: 1012.24, // Updated to peso pricing
      paymentMethod: 'Cash',
      discount: '',
      memo: 'Extra crispy, pickup 4 PM',
      time: '3:30 PM',
      date: '2024-11-21'
    }
  ]);

  const [currentOrder, setCurrentOrder] = useState({
    customer: 1,
    discount: '',
    paymentMethod: '',
    orderType: '',
    memo: '',
    items: []
  });

  const [orderSaved, setOrderSaved] = useState(false);
  const [savedOrderData, setSavedOrderData] = useState(null);
  const [includeServiceCharge, setIncludeServiceCharge] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [orderTypes, setOrderTypes] = useState([]);

  // Function to clear current order
  const clearCurrentOrder = () => {
    setCurrentOrder({
      customer: 1,
      discount: '',
      paymentMethod: '',
      orderType: '',
      memo: '',
      items: []
    });
    setOrderSaved(false);
    setSavedOrderData(null);
  };

  // Function to switch view and clear order when going to New Order
  const switchToNewOrder = () => {
    setCurrentView('menu');
    setCurrentPage(1); // Reset pagination
    clearCurrentOrder();
  };

  // Function to switch to order view and reset pagination
  const switchToOrderView = (viewType) => {
    setCurrentView(viewType);
    setCurrentPage(1); // Reset pagination
  };

  const [selectedCategory, setSelectedCategory] = useState('Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuItems, setMenuItems] = useState([]);

  // Order management state
  const [orderItems, setOrderItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [orderMemo, setOrderMemo] = useState('');
  const [showServiceCharge, setShowServiceCharge] = useState(true);

  const menuCategories = ['Items', 'Drinks', 'Discounts'];

  // Sample fallback data
  const fallbackItems = [
    { id: 1, name: 'BBQ Ribs', price: 1249.99, category: 'Items', image: '🍖' },
    { id: 2, name: 'Buffalo Wings', price: 649.99, category: 'Items', image: '🍗' },
    { id: 3, name: 'Chocolate Cake', price: 449.99, category: 'Items', image: '🎂' },
    { id: 4, name: 'Seasonal Salad', price: 749.99, category: 'Items', image: '🥗' },
    { id: 5, name: 'Grilled Chicken', price: 949.99, category: 'Items', image: '🍗' },
    { id: 6, name: 'Fish & Chips', price: 849.99, category: 'Items', image: '🐟' },
    { id: 7, name: 'Coca Cola', price: 149.99, category: 'Drinks', image: '🥤' },
    { id: 8, name: 'Fresh Orange Juice', price: 199.99, category: 'Drinks', image: '🧃' },
    { id: 9, name: 'Coffee', price: 125.00, category: 'Drinks', image: '☕' },
    { id: 10, name: 'Iced Tea', price: 137.75, category: 'Drinks', image: '🧊' },
    { id: 11, name: 'Sparkling Water', price: 112.25, category: 'Drinks', image: '💧' },
    { id: 12, name: 'Lemonade', price: 162.25, category: 'Drinks', image: '🍋' },
    { id: 13, name: 'Senior Citizen Discount', price: 20, category: 'Discounts', image: '👴' },
    { id: 14, name: 'PWD Discount', price: 20, category: 'Discounts', image: '♿' },
    { id: 15, name: 'Student Discount', price: 15, category: 'Discounts', image: '🎓' },
    { id: 16, name: 'Employee Discount', price: 25, category: 'Discounts', image: '👨‍💼' }
  ];

  // Fetch items from API
  const getAllItems = async () => {
    try {
      const response = await apiEndpoints.items.getAll();
      console.log("get all items", response.data.data);
      if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        setMenuItems(response.data.data);
      } else {
        console.log('Using fallback items data');
        setMenuItems(fallbackItems);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      console.log('Using fallback items data due to API error');
      setMenuItems(fallbackItems);
    }
  };

  // Fetch customers from API
  let getAllCustomers = async () => {
    try {
      // Assuming there's a customers endpoint similar to locations
      let response = await apiEndpoints.customers.getAll();
      console.log("getAllCustomers response", response);
      setCustomers(response.data.data);

      // For now, use sample data since API might not be implemented yet
      //  setCustomers(sampleCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fall back to sample data if API call fails
      setCustomers(sampleCustomers);
    }
  }

  // Fetch payment methods from API
  const getAllPaymentMethods = async () => {
    try {
      const response = await apiEndpoints.paymentMethods.getAll();
      if (response && response.data && Array.isArray(response.data)) {
        setPaymentMethods(response.data);
      } else {
        console.log('Using fallback payment methods data');
        setPaymentMethods(fallbackPaymentMethods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      console.log('Using fallback payment methods data due to API error');
      setPaymentMethods(fallbackPaymentMethods);
    }
  };

  let getAllOrderTypes = async () => {
    try {
      let response = await apiEndpoints.orderTypes.getAll();
      console.log("response", response);
      setOrderTypes(response.data.data);
    } catch (e) {
      console.error('Error fetching order types:', error);
    }
  }
  // Load all data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        getAllItems(),
        getAllCustomers(),
        getAllPaymentMethods(),
        getAllOrderTypes()
      ]);
      setLoading(false);
    };

    loadData();
  }, []);


  const filteredItems = Array.isArray(menuItems) ? menuItems.filter(item => {
    const itemCategory = item.category_name || item.category;
    return itemCategory === selectedCategory &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
  }) : [];

  const addToOrder = (item) => {
    const existingItem = orderItems.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setOrderItems(prev => prev.map(orderItem =>
        orderItem.id === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems(prev => [...prev, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(index);
    } else {
      setOrderItems(prev => prev.map((item, i) =>
        i === index ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromOrder = (index) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearOrder = () => {
    setOrderItems([]);
    setCurrentOrder({
      customer: '',
      discount: '',
      paymentMethod: '',
      orderType: '',
      memo: '',
      items: []
    });
  };

  const placeOrder = () => {
    if (orderItems.length === 0 || !currentOrder.customer || !currentOrder.paymentMethod || !currentOrder.orderType) {

      alert('Please complete all required fields and add items to the order.');

      return;
    }

    console.log('placeOrder  orderItems', orderItems);
    console.log('placeOrder  currentOrder', currentOrder);
    let arrItems = [];

    for (let idx = 0; idx < orderItems.length; idx++) {
      let decTaxAmount = orderItems[idx].price * orderItems[idx].quantity * 0.12;
      arrItems.push({
        item_id: orderItems[idx].id,
        quantity: orderItems[idx].quantity,
        rate: orderItems[idx].price,
        tax_percentage: 0.12,
        tax_amount: decTaxAmount,
        amount: orderItems[idx].price * orderItems[idx].quantity + decTaxAmount
      });
    }

    const newOrder = {
      "customer_id": currentOrder.customer,
      "status_id": 2, //Processing
      "order_type_id": currentOrder.orderType,
      "subtotal": subtotal,
      "tax_percentage": 0.12,
      "tax_amount": subtotal * 0.12,
      "total": total,
      "role_id": currentOrder.role_id,
      "location_id": currentOrder.location_id,
      "payment_method_id": currentOrder.paymentMethod,
      "created_by": currentOrder.created_by,
      "items": arrItems
      // type: 'completed',
      // items: arrItems,
      // total: total,
      // paymentMethod: paymentMethods.find(p => p.id == currentOrder.paymentMethod)?.name || 'Cash',
      // discount: currentOrder.discount || '',
      // memo: currentOrder.memo || '',
      // time: new Date().toLocaleTimeString(),
      // date: new Date().toLocaleDateString()
    };

    setOrders(prev => [newOrder, ...prev]);
    postNewOrder(newOrder);
    // clearOrder();
    console.log('placeOrder orderItems', newOrder);

  };

  let postNewOrder = async (data) => {
    try {
      let response = apiEndpoints.orders.create(data);
      alert('Order created successfully');
    } catch (e) {
      console.error('Error creating location:', error);
    }
  }
  // Calculate totals with new discount logic
  const regularItems = orderItems.filter(item => item.category !== 'Discounts' && item.category_name !== 'Discounts');
  const discountItems = orderItems.filter(item => item.category === 'Discounts' || item.category_name === 'Discounts');

  const subtotal = regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate discount from discount items (price is percentage)
  const discountPercentage = discountItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercentage / 100);

  const discountedSubtotal = subtotal - discountAmount;
  const serviceCharge = 0; // Remove 12% service charge as requested
  const serviceChargeAmount = serviceCharge;
  const tax = orderItems.length > 0 ? discountedSubtotal * 0.12 : 0; // 12% VAT
  const total = discountedSubtotal + tax;

  // Function to mark order as completed (serve)
  const serveOrder = (orderId) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, type: 'completed' }
          : order
      )
    );
  };

  // Function to save order
  const saveOrder = () => {
    const orderData = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customer: customers.find(c => c.id === currentOrder.customer)?.name || 'Walk-in Customer',
      customerAddress: '123 Main St., Barangay Sample, City, Philippines',
      items: currentOrder.items,
      discount: currentOrder.discount,
      paymentMethod: paymentMethods.find(p => p.id === currentOrder.paymentMethod)?.name || 'Cash',
      memo: currentOrder.memo,
      subtotal: subtotal,
      discountAmount: discountAmount,
      discountedSubtotal: discountedSubtotal,
      serviceCharge: serviceCharge,
      includeServiceCharge: includeServiceCharge,
      tax: tax,
      total: total,
      date: new Date().toLocaleDateString('en-PH'),
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      cashier: 'John Doe',
      type: 'completed'
    };

    setSavedOrderData(orderData);
    setOrderSaved(true);

    // Add to orders list
    setOrders(prev => [...prev, orderData]);

    // Reset current order
    setCurrentOrder({
      customer: 1,
      discount: '',
      paymentMethod: '',
      memo: '',
      items: []
    });
  };

  // Function to print receipt
  const printReceipt = () => {
    if (orderItems.length === 0) {
      alert('No items in the order to print.');
      return;
    }

    if (!currentOrder.customer || !currentOrder.paymentMethod || !currentOrder.orderType) {
      alert('Please select customer, payment method, and order type before printing receipt.');
      return;
    }

    // Create receipt data from current order
    const receiptData = {
      id: `ORD-${Date.now()}`,
      customer: customers.find(c => c.id == currentOrder.customer)?.name || customers.find(c => c.id == currentOrder.customer)?.full_name || 'Walk-in Customer',
      customerAddress: '123 Main St., Barangay Sample, City, Philippines',
      items: orderItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      discount: currentOrder.discount,
      paymentMethod: paymentMethods.find(p => p.id == currentOrder.paymentMethod)?.name || 'Cash',
      memo: currentOrder.memo,
      subtotal: subtotal,
      ordertype: currentOrder.orderType,
      discountAmount: discountAmount,
      discountedSubtotal: discountedSubtotal,
      serviceCharge: serviceCharge,
      includeServiceCharge: showServiceCharge,
      tax: tax,
      total: total,
      date: new Date().toLocaleDateString('en-PH'),
      time: new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
      cashier: 'John Doe',
      type: 'completed'
    };

    console.log('Printing receipt for order:', receiptData);

    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${receiptData.id}</title>
          <style>
            body {
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              margin: 0;
              padding: 10px;
              width: 300px;
            }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 5px 0; }
            .double-line { border-bottom: 2px solid #000; margin: 8px 0; }
            .receipt-header {
              text-align: center;
              margin-bottom: 15px;
            }
            .store-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .store-address {
              font-size: 10px;
              margin-bottom: 3px;
            }
            .receipt-info {
              margin: 10px 0;
            }
            .item-row {
              display: flex;
              justify-content: space-between;
              margin: 2px 0;
            }
            .item-name {
              flex: 1;
              padding-right: 10px;
            }
            .item-qty {
              width: 30px;
              text-align: center;
            }
            .item-price {
              width: 60px;
              text-align: right;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin: 3px 0;
              padding: 2px 0;
            }
            .total-row {
              font-weight: bold;
              font-size: 14px;
              border-top: 2px solid #000;
              padding-top: 5px;
              margin-top: 8px;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 10px;
            }
            .tax-info {
              font-size: 9px;
              margin-top: 10px;
              text-align: center;
            }
            @media print {
              body { width: auto; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <div class="store-name">RIBSHACK RESTAURANT</div>
            <div class="store-address">123 Food Street, Barangay Centro</div>
            <div class="store-address">Manila, Metro Manila, Philippines</div>
            <div class="store-address">Tel: (02) 8123-4567</div>
            <div class="store-address">TIN: 123-456-789-000</div>
          </div>

          <div class="double-line"></div>

          <div class="receipt-info">
            <div><strong>Receipt No:</strong> ${receiptData.id}</div>
            <div><strong>Date:</strong> ${receiptData.date}</div>
            <div><strong>Time:</strong> ${receiptData.time}</div>
            <div><strong>Cashier:</strong> ${receiptData.cashier}</div>
            <div><strong>Customer:</strong> ${receiptData.customer}</div>
            <div><strong>Order Type:</strong> ${receiptData.ordertype}</div>
            ${receiptData.memo ? `<div><strong>Notes:</strong> ${receiptData.memo}</div>` : ''}
          </div>

          <div class="line"></div>

          <div style="margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px;">
              <span>ITEM</span>
              <span style="width: 30px; text-align: center;">QTY</span>
              <span style="width: 60px; text-align: right;">AMOUNT</span>
            </div>
            ${receiptData.items.map(item => `
              <div class="item-row">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">${item.quantity}</span>
                <span class="item-price">₱${(parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="line"></div>

          <div style="margin: 8px 0;">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>₱${receiptData.subtotal.toFixed(2)}</span>
            </div>
            ${receiptData.discount ? `
              <div class="summary-row" style="color: #666;">
                <span>${receiptData.discount} Discount (${receiptData.discount === 'PWD' ? '20%' : '15%'}):</span>
                <span>-₱${receiptData.discountAmount.toFixed(2)}</span>
              </div>
              <div class="summary-row">
                <span>Discounted Subtotal:</span>
                <span>₱${receiptData.discountedSubtotal.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="summary-row">
              <span>Tax:</span>
              <span>₱${receiptData.tax.toFixed(2)}</span>
            </div>
          </div>

          <div class="summary-row total-row">
            <span>TOTAL AMOUNT:</span>
            <span>₱${receiptData.total.toFixed(2)}</span>
          </div>

          <div class="line"></div>

          <div style="margin: 8px 0;">
            <div class="summary-row">
              <span><strong>Payment Method:</strong></span>
              <span>${receiptData.paymentMethod}</span>
            </div>
          </div>

          <div class="tax-info">
            <div>VAT REG TIN: 123-456-789-000</div>
            <div>VAT included in total amount</div>
            <div>This serves as your official receipt</div>
          </div>

          <div class="footer">
            <div>Thank you for dining with us!</div>
            <div>Please come again!</div>
            <div style="margin-top: 10px;">www.ribshack.ph</div>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 10px;">
            Powered by RibShack POS System
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  // Function to render order table
  const renderOrderTable = (orderType) => {
    const filteredOrders = orders.filter(order => order.type === orderType);
    const title = orderType === 'completed' ? 'Completed Orders' :
      orderType === 'dineIn' ? 'Dine In Orders' : 'Take Out Orders';

    // Pagination for order tables
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
      setCurrentPage(page);
    };

    const renderPagination = () => {
      if (totalPages <= 1) return null;

      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      // Previous button
      if (currentPage > 1) {
        pages.push(
          <button
            key="prev"
            onClick={() => handlePageChange(currentPage - 1)}
            style={{
              padding: '0.5rem 0.75rem',
              margin: '0 0.25rem',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            ‹
          </button>
        );
      }

      // Page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            style={{
              padding: '0.5rem 0.75rem',
              margin: '0 0.25rem',
              background: currentPage === i ? '#3b82f6' : 'white',
              color: currentPage === i ? 'white' : '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: currentPage === i ? '600' : '400'
            }}
          >
            {i}
          </button>
        );
      }

      // Next button
      if (currentPage < totalPages) {
        pages.push(
          <button
            key="next"
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              padding: '0.5rem 0.75rem',
              margin: '0 0.25rem',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            ›
          </button>
        );
      }

      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          background: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div style={{ display: 'flex' }}>
              {pages}
            </div>
          </div>
        </div>
      );
    }; return (
      <div>
        <h2 style={{ margin: '0 0 2rem 0', color: '#1e293b' }}>{title}</h2>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          height: '650px',
          overflowY: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Order ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Customer</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Items</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Total</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Payment</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Discount</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Memo</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Time</th>
                {(orderType === 'dineIn' || orderType === 'takeOut') && (
                  <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: index % 2 === 0 ? '#fafbfc' : 'white'
                  }}
                >
                  <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '500' }}>{order.id}</td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>{order.customer}</td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>{order.items.join(', ')}</td>
                  <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '600' }}>₱{order.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>{order.paymentMethod}</td>
                  <td style={{ padding: '1rem', color: order.discount ? '#10b981' : '#6b7280' }}>
                    {order.discount || 'None'}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', maxWidth: '150px' }}>
                    <div style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem'
                    }}>
                      {order.memo || 'No notes'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{order.time}</td>
                  {(orderType === 'dineIn' || orderType === 'takeOut') && (
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => serveOrder(order.id)}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.5rem 1rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.background = '#059669'}
                        onMouseOut={(e) => e.target.style.background = '#10b981'}
                      >
                        Serve
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {currentOrders.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b7280'
            }}>
              No {title.toLowerCase()} found
            </div>
          )}
        </div>
        {/* Pagination */}
        {renderPagination()}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* Left Navigation */}
      <div style={{
        width: '280px',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #f1f5f9',
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>RIBSHACK POS</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>Order Management</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div style={{ padding: '1rem', flex: 1 }}>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{
              margin: '0 0 0.75rem 0',
              color: '#6b7280',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              fontWeight: '600',
              letterSpacing: '0.05em'
            }}>
              Order Types
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentView('menu')}
                style={{
                  background: currentView === 'menu' ? '#dc2626' : 'transparent',
                  color: currentView === 'menu' ? 'white' : '#374151',
                  border: currentView === 'menu' ? 'none' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0.875rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (currentView !== 'menu') {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#dc2626';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== 'menu') {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🛒</span>
                <span>New Order</span>
              </button>

              <button
                onClick={() => switchToOrderView('completed')}
                style={{
                  background: currentView === 'completed' ? '#10b981' : 'transparent',
                  color: currentView === 'completed' ? 'white' : '#374151',
                  border: currentView === 'completed' ? 'none' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0.875rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (currentView !== 'completed') {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#10b981';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== 'completed') {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>✓</span>
                <span>Completed Orders</span>
              </button>

              <button
                onClick={() => switchToOrderView('dineIn')}
                style={{
                  background: currentView === 'dineIn' ? '#3b82f6' : 'transparent',
                  color: currentView === 'dineIn' ? 'white' : '#374151',
                  border: currentView === 'dineIn' ? 'none' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0.875rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (currentView !== 'dineIn') {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#3b82f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== 'dineIn') {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>🍽️</span>
                <span>Dine In Orders</span>
              </button>

              <button
                onClick={() => switchToOrderView('takeOut')}
                style={{
                  background: currentView === 'takeOut' ? '#f59e0b' : 'transparent',
                  color: currentView === 'takeOut' ? 'white' : '#374151',
                  border: currentView === 'takeOut' ? 'none' : '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '0.875rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (currentView !== 'takeOut') {
                    e.target.style.background = '#f8fafc';
                    e.target.style.borderColor = '#f59e0b';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentView !== 'takeOut') {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>📦</span>
                <span>Take Out Orders</span>
              </button>
            </div>
          </div>
        </div>

        {/* Back to Dashboard Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <button
            onClick={onBack}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.875rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#4b5563';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#6b7280';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🏠</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontSize: '1.5rem' }}>
                {currentView === 'menu' ? 'New Order - Menu' :
                  currentView === 'completed' ? 'Completed Orders' :
                    currentView === 'dineIn' ? 'Dine In Orders' : 'Take Out Orders'}
              </h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                {currentView === 'menu' ? 'Select items and create new orders' :
                  'Manage and view order status'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {currentView === 'menu' ? (
            <div style={{ display: 'flex', height: '100%' }}>
              {/* Left Side - Menu Items (60%) */}
              <div style={{
                flex: '0 0 60%',
                background: 'white',
                padding: '2rem',
                borderRight: '1px solid #e5e7eb',
                overflow: 'auto'
              }}>
                {/* Top Row - Customer, Payment Method, Order Type, Search */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e5e7eb'
                }}>
                  {/* First Row */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Customer Selection */}
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '0.9rem'
                      }}>
                        👤 Customer *
                      </label>
                      <select
                        value={8}
                        onChange={(e) => setCurrentOrder(prev => ({ ...prev, customer: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          color: '#1e293b',
                          background: 'white',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.full_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Payment Method */}
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '0.9rem'
                      }}>
                        💳 Payment Method *
                      </label>
                      <select
                        value={currentOrder.paymentMethod}
                        onChange={(e) => setCurrentOrder(prev => ({ ...prev, paymentMethod: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          color: '#1e293b',
                          background: 'white',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Payment Method</option>
                        {paymentMethods.map(method => (
                          <option key={method.id} value={method.id}>
                            {method.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {/* Order Type */}
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '0.9rem'
                      }}>
                        🍽️ Order Type *
                      </label>
                      <select
                        value={currentOrder.orderType}
                        onChange={(e) => setCurrentOrder(prev => ({ ...prev, orderType: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          color: '#1e293b',
                          background: 'white',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select Order Type</option>
                        {orderTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Search Items */}
                    <div style={{ flex: 1, position: 'relative' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: '600',
                        color: '#374151',
                        fontSize: '0.9rem'
                      }}>
                        🔍 Search Items
                      </label>
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingLeft: '2.5rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        left: '0.75rem',
                        bottom: '0.75rem',
                        fontSize: '1rem',
                        color: '#9ca3af'
                      }}>🔍</span>
                    </div>
                  </div>
                </div>
                {/* Category Tabs */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '2rem',
                  overflowX: 'auto',
                  paddingBottom: '0.5rem'
                }}>
                  {menuCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        background: selectedCategory === category ? '#1f2937' : 'white',
                        color: selectedCategory === category ? 'white' : '#374151',
                        border: '2px solid #e5e7eb',
                        borderRadius: '25px',
                        padding: '0.75rem 1.5rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Menu Items Table */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #f1f5f9'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Item</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Item type</th>
                        <th style={{ padding: '1rem', textAlign: 'right', color: '#374151', fontWeight: '600' }}>Price</th>
                        <th style={{ padding: '1rem', textAlign: 'center', color: '#374151', fontWeight: '600' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, index) => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: index % 2 === 0 ? '#fafbfc' : 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#fafbfc' : 'white'}
                        >
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{
                              fontSize: '2.5rem',
                              width: '60px',
                              height: '60px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: '#f8fafc',
                              borderRadius: '12px',
                              margin: '0 auto'
                            }}>
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : null}
                            </div>

                          </td>
                          <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '500', fontSize: '1.1rem' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.95rem' }}>
                            {item.category_name}
                          </td>
                          <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '600', fontSize: '1.2rem', textAlign: 'right' }}>
                            {(item.category === 'Discounts' || item.category_name === 'Discounts')
                              ? `${parseFloat(item.price).toFixed(0)}%`
                              : `₱${parseFloat(item.price).toFixed(2)}`
                            }
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <button
                              onClick={() => addToOrder(item)}
                              style={{
                                background: '#1f2937',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                width: '45px',
                                height: '45px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                                margin: '0 auto'
                              }}
                              onMouseOver={(e) => {
                                e.target.style.background = '#374151';
                                e.target.style.transform = 'scale(1.05)';
                              }}
                              onMouseOut={(e) => {
                                e.target.style.background = '#1f2937';
                                e.target.style.transform = 'scale(1)';
                              }}
                            >
                              +
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loading && (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#6b7280'
                    }}>
                      Loading items...
                    </div>
                  )}
                  {!loading && filteredItems.length === 0 && (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#6b7280'
                    }}>
                      No items found for "{selectedCategory}" category
                    </div>
                  )}
                </div>
              </div>

              {/* Current Order Section - 40% */}
              <div style={{
                flex: '0 0 40%',
                background: 'white',
                padding: '2rem',
                borderLeft: '1px solid #e5e7eb',
                overflow: 'auto'
              }}>
                {/* Order Items */}
                <div style={{
                  maxHeight: '350px',
                  overflowY: 'auto',
                  marginBottom: '1.5rem',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  {orderItems.length === 0 ? (
                    <p style={{
                      textAlign: 'center',
                      color: '#9ca3af',
                      padding: '2rem',
                      fontSize: '1.1rem'
                    }}>
                      No items in current order
                    </p>
                  ) : (
                    orderItems.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem',
                          background: 'white',
                          borderRadius: '8px',
                          marginBottom: '0.75rem',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <span style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            fontSize: '1rem'
                          }}>
                            {item.name}
                          </span>
                          <div style={{
                            color: '#6b7280',
                            fontSize: '0.9rem',
                            marginTop: '0.25rem'
                          }}>
                            {(item.category === 'Discounts' || item.category_name === 'Discounts')
                              ? `${parseFloat(item.price).toFixed(0)}% discount`
                              : `₱${parseFloat(item.price).toFixed(2)} each`
                            }
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#f3f4f6',
                            borderRadius: '6px',
                            padding: '0.25rem'
                          }}>
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              -
                            </button>
                            <span style={{
                              fontWeight: '600',
                              minWidth: '20px',
                              textAlign: 'center',
                              color: '#1f2937'
                            }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              +
                            </button>
                          </div>
                          <span style={{
                            fontWeight: 'bold',
                            color: '#1f2937',
                            fontSize: '1.1rem',
                            minWidth: '70px',
                            textAlign: 'right'
                          }}>
                            ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromOrder(index)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.4rem 0.6rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Memo Field */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '1rem'
                  }}>
                    Order Memo (Optional)
                  </label>
                  <textarea
                    value={currentOrder.memo}
                    onChange={(e) => setCurrentOrder(prev => ({ ...prev, memo: e.target.value }))}
                    placeholder="Add special instructions or notes..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Order Summary */}
                <div style={{
                  background: '#f9fafb',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.75rem',
                    fontSize: '1.1rem'
                  }}>
                    <span style={{ color: '#6b7280' }}>Subtotal:</span>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>
                      ₱{subtotal.toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      fontSize: '1rem',
                      color: '#ef4444'
                    }}>
                      <span>Discount ({discountPercentage.toFixed(0)}%):</span>
                      <span>-₱{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {tax > 0 && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      fontSize: '1rem',
                      color: '#059669'
                    }}>
                      <span>Tax (12%):</span>
                      <span>₱{tax.toFixed(2)}</span>
                    </div>
                  )}
                  {/* {showServiceCharge && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      fontSize: '1rem',
                      color: '#059669'
                    }}>
                      <span>Service Charge (10%):</span>
                      <span>₱{serviceChargeAmount.toFixed(2)}</span>
                    </div>
                  )} */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '2px solid #e5e7eb',
                    paddingTop: '0.75rem',
                    fontSize: '1.4rem',
                    fontWeight: 'bold'
                  }}>
                    <span style={{ color: '#1f2937' }}>Total:</span>
                    <span style={{ color: '#dc2626' }}>
                      ₱{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexDirection: 'column'
                }}>
                  <button
                    onClick={placeOrder}
                    disabled={orderItems.length === 0 || !currentOrder.customer || !currentOrder.paymentMethod || !currentOrder.orderType}
                    style={{
                      background: orderItems.length === 0 || !currentOrder.customer || !currentOrder.paymentMethod || !currentOrder.orderType ? '#9ca3af' : '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '1rem 2rem',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      cursor: orderItems.length === 0 || !currentOrder.customer || !currentOrder.paymentMethod || !currentOrder.orderType ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    Place Order (₱{total.toFixed(2)})
                  </button>
                  <div style={{
                    display: 'flex',
                    gap: '0.75rem'
                  }}>
                    <button
                      onClick={clearOrder}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        flex: 1
                      }}
                    >
                      Clear Order
                    </button>
                    <button
                      onClick={printReceipt}
                      disabled={orderItems.length === 0}
                      style={{
                        background: orderItems.length === 0 ? '#9ca3af' : '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        cursor: orderItems.length === 0 ? 'not-allowed' : 'pointer',
                        flex: 1
                      }}
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Render order tables for completed, dineIn, or takeOut
            <div style={{ padding: '1.5rem' }}>
              {renderOrderTable(currentView)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderMenu;
