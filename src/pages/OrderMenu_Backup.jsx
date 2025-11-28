import React, { useState } from 'react';

const OrderMenu = ({ onBack }) => {
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'completed', 'dineIn', 'takeOut'
  
  const [customers] = useState([
    { id: 1, name: 'Emma Wang' },
    { id: 2, name: 'John Doe' },
    { id: 3, name: 'Jane Smith' },
    { id: 4, name: 'Mike Johnson' },
    { id: 5, name: 'Sarah Wilson' },
    { id: 6, name: 'David Brown' }
  ]);

  const [paymentMethods] = useState([
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' },
    { id: 3, name: 'Debit Card' },
    { id: 4, name: 'GCash' },
    { id: 5, name: 'Maya' },
    { id: 6, name: 'Bank Transfer' }
  ]);

  // Sample orders data
  const [orders] = useState([
    {
      id: 'ORD-001',
      customer: 'Emma Wang',
      type: 'completed',
      items: ['BBQ Ribs', 'Coca Cola'],
      total: 27.99,
      paymentMethod: 'Cash',
      discount: 'PWD',
      time: '2:30 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-002',
      customer: 'John Doe',
      type: 'dineIn',
      items: ['Buffalo Wings', 'Coffee'],
      total: 15.49,
      paymentMethod: 'Credit Card',
      discount: '',
      time: '3:15 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-003',
      customer: 'Jane Smith',
      type: 'takeOut',
      items: ['Chocolate Cake', 'Fresh Orange Juice'],
      total: 12.98,
      paymentMethod: 'GCash',
      discount: 'Senior',
      time: '1:45 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-004',
      customer: 'Mike Johnson',
      type: 'completed',
      items: ['Grilled Chicken', 'Iced Tea'],
      total: 21.74,
      paymentMethod: 'Debit Card',
      discount: '',
      time: '12:30 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-005',
      customer: 'Sarah Wilson',
      type: 'dineIn',
      items: ['Seasonal Salad', 'Sparkling Water'],
      total: 17.24,
      paymentMethod: 'Maya',
      discount: '',
      time: '2:00 PM',
      date: '2024-11-21'
    },
    {
      id: 'ORD-006',
      customer: 'David Brown',
      type: 'takeOut',
      items: ['Fish & Chips', 'Lemonade'],
      total: 20.24,
      paymentMethod: 'Cash',
      discount: '',
      time: '3:30 PM',
      date: '2024-11-21'
    }
  ]);

  const [currentOrder, setCurrentOrder] = useState({
    customer: 1, // Customer ID instead of name
    discount: '', // '' (none), 'PWD', 'Senior'
    paymentMethod: '', // Payment method ID
    items: [
      { id: 1, name: 'Raspberry Tart', price: 8.12, quantity: 1, image: '🧁' },
      { id: 2, name: 'Lemon Tart', price: 2.86, quantity: 1, image: '🍋' }
    ]
  });

  const [selectedCategory, setSelectedCategory] = useState('Items');
  const [searchTerm, setSearchTerm] = useState('');

  const menuCategories = ['Items', 'Drinks'];

  const menuItems = [
    // Items (Food)
    {
      id: 1,
      name: 'BBQ Ribs',
      price: 24.99,
      category: 'Items',
      image: '🍖',
      description: 'Tender slow-cooked ribs with our signature BBQ sauce'
    },
    {
      id: 2,
      name: 'Buffalo Wings',
      price: 12.99,
      category: 'Items',
      image: '🍗',
      description: 'Crispy chicken wings tossed in spicy buffalo sauce'
    },
    {
      id: 3,
      name: 'Chocolate Cake',
      price: 8.99,
      category: 'Items',
      image: '🎂',
      description: 'Rich chocolate layer cake with chocolate frosting'
    },
    {
      id: 4,
      name: 'Seasonal Salad',
      price: 14.99,
      category: 'Items',
      image: '🥗',
      description: 'Mixed greens with seasonal vegetables and house dressing'
    },
    {
      id: 5,
      name: 'Grilled Chicken',
      price: 18.99,
      category: 'Items',
      image: '🍗',
      description: 'Herb-marinated grilled chicken breast'
    },
    {
      id: 6,
      name: 'Fish & Chips',
      price: 16.99,
      category: 'Items',
      image: '🐟',
      description: 'Beer-battered fish with crispy fries'
    },
    // Drinks (Beverages)
    {
      id: 7,
      name: 'Coca Cola',
      price: 2.99,
      category: 'Drinks',
      image: '🥤',
      description: 'Classic cola drink'
    },
    {
      id: 8,
      name: 'Fresh Orange Juice',
      price: 3.99,
      category: 'Drinks',
      image: '🧃',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 9,
      name: 'Coffee',
      price: 2.50,
      category: 'Drinks',
      image: '☕',
      description: 'Premium roasted coffee'
    },
    {
      id: 10,
      name: 'Iced Tea',
      price: 2.75,
      category: 'Drinks',
      image: '🧊',
      description: 'Refreshing iced tea'
    },
    {
      id: 11,
      name: 'Sparkling Water',
      price: 2.25,
      category: 'Drinks',
      image: '💧',
      description: 'Premium sparkling mineral water'
    },
    {
      id: 12,
      name: 'Lemonade',
      price: 3.25,
      category: 'Drinks',
      image: '🍋',
      description: 'Fresh homemade lemonade'
    }
  ];

  const filteredItems = menuItems.filter(item => 
    item.category === selectedCategory && 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (item) => {
    const existingItem = currentOrder.items.find(orderItem => orderItem.id === item.id);
    if (existingItem) {
      setCurrentOrder(prev => ({
        ...prev,
        items: prev.items.map(orderItem =>
          orderItem.id === item.id
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        )
      }));
    } else {
      setCurrentOrder(prev => ({
        ...prev,
        items: [...prev.items, { ...item, quantity: 1 }]
      }));
    }
  };

  const updateQuantity = (itemId, change) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean)
    }));
  };

  const subtotal = currentOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate discount - PWD: 20%, Senior: 15%
  const discountRate = currentOrder.discount === 'PWD' ? 0.20 : currentOrder.discount === 'Senior' ? 0.15 : 0;
  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = subtotal - discountAmount;
  
  const serviceCharge = discountedSubtotal * 0.20;
  const tax = 0.50;
  const total = discountedSubtotal + serviceCharge + tax;

  // Function to render order table
  const renderOrderTable = (orderType) => {
    const filteredOrders = orders.filter(order => order.type === orderType);
    const title = orderType === 'completed' ? 'Completed Orders' : 
                  orderType === 'dineIn' ? 'Dine In Orders' : 'Take Out Orders';

    return (
      <div>
        <h2 style={{ margin: '0 0 2rem 0', color: '#1e293b' }}>{title}</h2>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
                <th style={{ padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
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
                  <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '600' }}>£{order.total.toFixed(2)}</td>
                  <td style={{ padding: '1rem', color: '#1e293b' }}>{order.paymentMethod}</td>
                  <td style={{ padding: '1rem', color: order.discount ? '#10b981' : '#6b7280' }}>
                    {order.discount || 'None'}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem', 
              color: '#6b7280' 
            }}>
              No {title.toLowerCase()} found
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc' }}>
      {/* Left Panel - Menu Items */}
      <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '2rem' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                marginRight: '1rem',
                padding: '0.5rem',
                borderRadius: '50%',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#f1f5f9'}
              onMouseOut={(e) => e.target.style.background = 'none'}
            >
              ←
            </button>
            <div>
              <h2 style={{ margin: 0, color: '#1e293b' }}>Menu</h2>
              <h3 style={{ margin: 0, color: '#64748b', fontWeight: 'normal' }}>Items & Beverages</h3>
            </div>
          </div>
          
          {/* Order Status Dashboard Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setCurrentView('completed')}
              style={{
                background: currentView === 'completed' ? '#059669' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#059669'}
              onMouseOut={(e) => e.target.style.background = currentView === 'completed' ? '#059669' : '#10b981'}
            >
              <span>✓</span>
              <span>Completed</span>
            </button>
            <button
              onClick={() => setCurrentView('dineIn')}
              style={{
                background: currentView === 'dineIn' ? '#2563eb' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#2563eb'}
              onMouseOut={(e) => e.target.style.background = currentView === 'dineIn' ? '#2563eb' : '#3b82f6'}
            >
              <span>🍽️</span>
              <span>Dine In</span>
            </button>
            <button
              onClick={() => setCurrentView('takeOut')}
              style={{
                background: currentView === 'takeOut' ? '#d97706' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#d97706'}
              onMouseOut={(e) => e.target.style.background = currentView === 'takeOut' ? '#d97706' : '#f59e0b'}
            >
              <span>📦</span>
              <span>Take Out</span>
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              style={{
                background: currentView === 'menu' ? '#7c3aed' : '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#7c3aed'}
              onMouseOut={(e) => e.target.style.background = currentView === 'menu' ? '#7c3aed' : '#8b5cf6'}
            >
              <span>🛒</span>
              <span>New Order</span>
            </button>
          </div>
        </div>

        {/* Conditional Content Based on View */}
        {currentView === 'menu' ? (
          <div>
            {/* Search Bar */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  paddingLeft: '3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.2rem',
                color: '#9ca3af'
              }}>🔍</span>
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

            {/* Menu Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}>
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    fontSize: '4rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    {item.image}
                  </div>
                  <h4 style={{
                    margin: '0 0 0.5rem 0',
                    fontSize: '1.1rem',
                    color: '#1e293b'
                  }}>
                    {item.name}
                  </h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      color: '#1e293b'
                    }}>
                      £{item.price.toFixed(2)}
                    </span>
                    <button
                      onClick={() => addToOrder(item)}
                      style={{
                        background: '#1f2937',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#374151'}
                      onMouseOut={(e) => e.target.style.background = '#1f2937'}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Render order tables for completed, dineIn, or takeOut
          renderOrderTable(currentView)
        )}
      </div>

      {/* Right Panel - Current Order - Only show when in menu view */}
      {currentView === 'menu' && (
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem',
              paddingLeft: '3rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            color: '#9ca3af'
          }}>🔍</span>
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

        {/* Menu Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                fontSize: '4rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                {item.image}
              </div>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.1rem',
                color: '#1e293b'
              }}>
                {item.name}
              </h4>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  color: '#1e293b'
                }}>
                  £{item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToOrder(item)}
                  style={{
                    background: '#1f2937',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#374151'}
                  onMouseOut={(e) => e.target.style.background = '#1f2937'}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Current Order */}
      <div style={{
        width: '400px',
        background: 'white',
        padding: '2rem',
        borderLeft: '1px solid #e5e7eb',
        overflow: 'auto'
      }}>
        <h3 style={{
          margin: '0 0 1.5rem 0',
          fontSize: '1.5rem',
          color: '#1e293b'
        }}>
          Current Order
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#8b5cf6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            👤
          </div>
          <select
            value={currentOrder.customer}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, customer: parseInt(e.target.value) }))}
            style={{
              fontSize: '1.1rem',
              color: '#1e293b',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              flex: 1
            }}
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {/* Discount Selection */}
        <div style={{
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem' }}>Discount Type</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="discount"
                value=""
                checked={currentOrder.discount === ''}
                onChange={(e) => setCurrentOrder(prev => ({ ...prev, discount: e.target.value }))}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: '#1e293b' }}>No Discount</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="discount"
                value="PWD"
                checked={currentOrder.discount === 'PWD'}
                onChange={(e) => setCurrentOrder(prev => ({ ...prev, discount: e.target.value }))}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: '#1e293b' }}>PWD (20%)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="discount"
                value="Senior"
                checked={currentOrder.discount === 'Senior'}
                onChange={(e) => setCurrentOrder(prev => ({ ...prev, discount: e.target.value }))}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: '#1e293b' }}>Senior (15%)</span>
            </label>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem',
          background: '#f8fafc',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem'
          }}>
            💳
          </div>
          <select
            value={currentOrder.paymentMethod}
            onChange={(e) => setCurrentOrder(prev => ({ ...prev, paymentMethod: parseInt(e.target.value) }))}
            style={{
              fontSize: '1.1rem',
              color: '#1e293b',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              background: 'white',
              cursor: 'pointer',
              outline: 'none',
              flex: 1
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

        {/* Order Items */}
        <div style={{ marginBottom: '2rem' }}>
          {currentOrder.items.map(item => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 0',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#f8fafc',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                {item.image}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>{item.name}</div>
                <div style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  £{item.price.toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{
          borderTop: '2px solid #f1f5f9',
          paddingTop: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Subtotal</span>
            <span>£{subtotal.toFixed(2)}</span>
          </div>
          {currentOrder.discount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#10b981' }}>{currentOrder.discount} Discount ({(discountRate * 100).toFixed(0)}%)</span>
              <span style={{ color: '#10b981' }}>-£{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#64748b' }}>Service Charge</span>
            <span>20%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#64748b' }}>Tax</span>
            <span>£{tax.toFixed(2)}</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            borderTop: '2px solid #f1f5f9',
            paddingTop: '1rem'
          }}>
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Continue Button */}
        <button
          style={{
            width: '100%',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.background = '#7c3aed'}
          onMouseOut={(e) => e.target.style.background = '#8b5cf6'}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OrderMenu;