import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { apiEndpoints } from './services/api';
import './App.css';

// --- ICONS & ASSETS IMPORT ---
import { AiFillAccountBook } from "react-icons/ai";
import {
  TbShoppingCart, TbBox, TbClipboard, TbMapPin, TbUsers, TbFileInvoice,
  TbCash, TbUser, TbBolt, TbReceipt,
  TbToolsKitchen2,
  TbShoppingBag,
  TbTruckDelivery,
  TbDots,  
  TbEdit,   
  TbNote
} from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaTrash } from "react-icons/fa6";

// Image Imports
import squaredMenuIcon from './assets/images/squared-menu.png';
import billIcon from './assets/images/bill.png';
import queueIcon from './assets/images/queue.png';
import historyIcon from './assets/images/history.png';
import graphIcon from './assets/images/graph.png';
import settingsIcon from './assets/images/settings.png';
import helpIcon from './assets/images/help.png';
import signOutIcon from './assets/images/sign-out.png';

// Placeholder Pages
import Items from './pages/Items';
import ItemTypes from './pages/ItemTypes';
import Locations from './pages/Locations';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import OrderTypes from './pages/OrderTypes';
import PaymentMethods from './pages/PaymentMethods';
import Roles from './pages/Roles';
import Status from './pages/Status';
import Users from './pages/Users';
import TaxConfig from './pages/TaxConfig';
import CreditCards from './pages/CreditCards';
import OrderMenu from './pages/OrderMenu';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Help from './pages/Help';


// --- UTILS ---
let objCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

let getTheFirstCharacter = (st) => {
  if (!st) return "U";
  return st.charAt(0).toUpperCase();
}

// --- ORDER BILL COMPONENT ---
function OrderBillPanel({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  orderType,
  setOrderType,
  onCheckout,
  totals,
  isProcessing
}) {
  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // State for modal
  const [isOptionsModalOpen, setIsOptionsModalOPen] = useState(false);
  const [orderNote, setOrderNote] = useState('');
  const [isNoteFieldVisible, setIsNoteFieldVisible] = useState(false);

  // Handler for modal options
  const handleOPtionClick = (action) => {
    console.log(`Action triggered: ${action}`);
    setIsOptionsModalOPen(false);

    switch (action) {
      case 'newOrder':
        onClearCart();
        setOrderNote('');
        setIsNoteFieldVisible(false);
        break;
      case 'voidOrder':
        alert('Void order functionality not yet implemented.');
        break;
      case 'splitBill':
        alert('Split Bill functionality not yet implemented.');
        break;
      case 'cancelOrder':
        onClearCart();
        setOrderNote('');
        setIsNoteFieldVisible(false);
        break;
      case 'reportIssue':
        alert('Report Issue functionality not yet implemented.');
        break;
      case 'addOrderNote':
        setIsNoteFieldVisible(true);
        break;
      default:
        break;
    }
  };

  return (
    <div className='bill-panel' style={{ position: 'relative' }}>
      {/* Header */}
      <div className='bill-header'>
        <h2 className='bill-title'>New Order Bill</h2>
        <button
          onClick={() => setIsOptionsModalOPen(true)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <TbDots size={24} color="#9ca3af" />
        </button>
      </div>

      {/* Options Modal */}
      {isOptionsModalOpen && (
       <>
    {/* 1. Overlay to close modal when clicking outside */}
    <div 
      className="modal-overlay" 
      onClick={() => setIsOptionsModalOPen(false)} 
    />
    
    {/* 2. The Modal Box */}
    <div className="options-modal">
      
      {/* 3. The "OPTIONS" Header (Matches image) */}
      <h3 className="options-header">OPTIONS</h3>
      
      <ul className="options-list">
        <li>
          <button onClick={() => handleOPtionClick('newOrder')}>New Order</button>
        </li>
        <li>
          <button onClick={() => handleOPtionClick('voidOrder')}>Void Order</button>
        </li>
        <li>
          <button onClick={() => handleOPtionClick('splitBill')}>Split Bill</button>
        </li>
        <li>
          <button onClick={() => handleOPtionClick('cancelOrder')}>Cancel Order</button>
        </li>
        <li>
          <button onClick={() => handleOPtionClick('reportIssue')}>Report Issue</button>
        </li>
        <li>
          <button onClick={() => handleOPtionClick('addOrderNote')}>Add Order Note</button>
        </li>
      </ul>
    </div>
  </>
      )}

      {/* Order Type Toggles */}
      <div className='order-type-group'>
        {[
          { id: 1, label: 'Dine In', icon: <TbToolsKitchen2 size={18} />},
          { id: 2, label: 'Takeout', icon: <TbShoppingBag size={18}/>},
          { id: 3, label: 'Delivery', icon: <TbTruckDelivery size={18}/>},
        ].map((type) => (
          <button
            key={type.id}
            className={`order-type-btn ${orderType === type.id ? 'active' : ''}`}
            onClick={() => setOrderType(type.id)}
          >
            {type.icon} {type.label}
          </button>
        ))}
      </div>

      {/* Info Grid */}
      <div className='bill-info-grid'>
        <span>Order Number</span> <span className='bill-info-value'>#NEW</span>
        <span>Date</span> <span className='bill-info-value'>{new Date().toLocaleDateString()}</span>
        <span>Time</span> <span className='bill-info-value'>{new Date().toLocaleTimeString()}</span>
        <span>Cashier</span> <span className='bill-info-value'>{currentUser?.username || 'Admin'}</span>
      </div>

      {/* Ordered Items List */}
      <h3 className='bill-items-header'>Ordered Items</h3>
      <div className='bill-items-list'>
        {cartItems.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: '#999'}}>
            No items added
          </div>
        ) : (
          cartItems.map((item, index) => (
            <div className='bill-item-row' key={`${item.id}-${index}`}>
              <div style={{ display: 'flex', alignItems: 'center', flex: 2, minWidth: 0}}>
                <div
                  className='bill-item-qty'
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  style={{cursor: 'pointer'}}
                >
                  {item.quantity}
                </div>
                <span className='bill-item-name'>{item.item_name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span className='bill-item-price'>
                  {formatCurrency(item.price * item.quantity)}
                </span>
                <FaTrash
                  size={16}
                  color="#ef4444"
                  style={{ cursor: 'pointer' }}
                  onClick={() => onRemoveItem(item.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Note Field */}
      {isNoteFieldVisible && (
        <div style={{ padding: '10px 20px' }}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <TbNote size={16} style={{ marginRight: '5px'}} />
            <span style={{ fontWeight: 'bold' }}>Order Note:</span>
          </div>
          <textarea
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            placeholder='Add a note for this order...'
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              resize: 'vertical',
              minHeight: '60px'
            }}
          />
        </div>
      )}

      {/* Footer Summary*/}
      <div style={{ marginTop: 'auto' }}>
        <div className='bill-summary'>
          <div className='summary-row'>
            <span>Sub Total</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className='summary-row'>
            <span>Discount</span>
            <span>₱ 0.00</span>
          </div>
          <div className='summary-row'>
            <span>Tax (12%)</span>
            <span>{formatCurrency(totals.tax)}</span>
          </div>
        </div>

        <button
          className='pay-button'
          onClick={onCheckout}
          disabled={isProcessing || cartItems.length === 0}
          style={{ opacity: isProcessing ? 0.7 : 1}}
        >
          {isProcessing ? 'PROCESSING...' : formatCurrency(totals.total)}
        </button>
      </div>
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
function Dashboard() {
  const navigate = useNavigate();

  const [layouts, setLayouts] = useState([]);
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  const [gridItems, setGridItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [orderType, setOrderType] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Fetch Layouts
  useEffect (() => {
    const fetchLayouts = async () => {

      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const locationId = currentUser.location_id || 15;

      try {
        const response = await apiEndpoints.layouts.getByLocation(locationId);
        console.log("Layouts API Response:", response.data);

        if (response.data && response.data.success) {
          const fetchedLayouts = response.data.data;
          setLayouts(fetchedLayouts);

          // Select first layout automatically
          if ( fetchedLayouts.length > 0) {
            handleLayoutClick(fetchedLayouts[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching layouts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
  }, []);

  // Fetch Grid items
  const handleLayoutClick = async (layout) => {
    setActiveLayoutId(layout.id);

    // Get location_id from local storage (default to 15)
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const locationId = currentUser.location_id || 15;

    try {
      const response = await apiEndpoints.layoutPosTerminal.getByLayoutAndLocation(layout.id, locationId);

      if (response.data && response.data.success) {
        setGridItems(response.data.data);
      } else {
        setGridItems([]);
      }
    } catch (error) {
      console.error("Error fetching grid items:", error);
      setGridItems([]);
    }
  };
  
  // Add Item to Cart
  const handleAddToCart = (item) => {
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

  // Remove Item
  const handleRemoveItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // Update Quantity
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  // Calculate Totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const taxRate = 0.12;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Checkout
  const handleCheckout = async () => {
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
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to create order.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='app-container'>
        <div className='dashboard-container'>
            
            {/* LEFT SIDE: Menu Section */}
            <div className='menu-section'>
                {/*Categories Row*/}
                <h3 className='section-title'>CATEGORIES</h3>

                <div className='itm-cat-container'>
                    {loading ? (
                    <p style={{padding: '1rem'}}>Loading menu...</p>
                    ) : layouts.length === 0 ? (
                    <div style={{ padding: '1rem', color: 'red', border: '1px dashed red', borderRadius: '8px'}}>
                        No Layouts Found. Check database connection.
                    </div>
                    ) : (
                    layouts.map((layout) => (
                        <button
                        key={layout.id}
                        className={`itm-cat-btn ${activeLayoutId === layout.id ? 'active' : ''}`}
                        onClick={() => handleLayoutClick(layout)}
                        >
                        <span>{layout.name ? layout.name.toUpperCase() : 'UNNAMED'}</span>
                        </button>
                    ))
                    )}
                </div>

                {/*Items Menu Grid*/}
                <div>
                    <h3 className='section-title'>ITEMS</h3>

                    {!loading && gridItems.length === 0 && (
                    <p style={{ color: '#666', fontStyle: 'italic'}}>No items assigned to this layout.</p>
                    )}

                    <div className='menu-itm-grid'>
                    {gridItems.map((pos) => (
                        <button 
                        key={pos.id}
                        className='menu-itm-card'
                        onClick={() => handleAddToCart(pos)}
                        >
                        <span className='card-label'>{pos.item_name || "Unknown Item"}</span>
                        </button>
                    ))}
                    </div>
                </div>
            </div>
            
            {/* RIGHT SIDE: Bill Panel */}
            <OrderBillPanel
              cartItems={cartItems}
              onRemoveItem={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              orderType={orderType}
              setOrderType={setOrderType}
              onCheckout={handleCheckout}
              totals={calculateTotals()}
              isProcessing={isProcessing} 
            />
            
        </div>
    </div>
  );
}

// --- MAIN LAYOUT COMPONENT ---
function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval (() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // 1. STATE: Sidebar Visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const iconStyle = { width: '30px', height: '30px' };

  const sideMenuItems = [
    { id: 'dashboard', icon: <img src={squaredMenuIcon} style={iconStyle} alt="Dashboard" />, path: '/' },
    { id: 'items', icon: <img src={billIcon} style={iconStyle} alt="Items" />, path: '/items' },
    { id: 'itemTypes', icon: <img src={queueIcon} style={iconStyle} alt="Types" />, path: '/itemtypes' },
    { id: 'locations', icon: <img src={historyIcon} style={iconStyle} alt="Locations" />, path: '/locations' },
    { id: 'customers', icon: <img src={graphIcon} style={iconStyle} alt="Customers" />, path: '/customers' },
  ];

  return (
    <div className='main-layout-container'>
      
      {/* 2. OVERLAY: Visible only when sidebar is open */}
      {isSidebarOpen && (
        <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 3. SIDEBAR: 'open' class slides it in */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className='sidebar-logo'>
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <RxHamburgerMenu style={{ width: '28px', height: '28px', color: '#333' }} />
          </button>
        </div>

        <nav className='sidebar-nav'>
          {sideMenuItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false); // Close on nav
                }}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
              </button>
            );
          })}
        </nav>

        <div className='sidebar-bottom-actions'>
          {/*Settings Button*/}
           <button onClick={() => {
                  navigate('/settings');
                  setIsSidebarOpen(false);
                } 
              }
              className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}
            >
             <img src={settingsIcon} style={iconStyle} alt="Settings" />
           </button>
          {/*Help Button*/}
           <button onClick={() => {
                navigate('/help');
                setIsSidebarOpen(false);
              }
           } 
            className='nav-item'
            >
             <img src={helpIcon} style={iconStyle} alt="Help" />
           </button>
        </div>
          {/*Signout Button*/}
        <div className='sidebar-footer'>
          <button onClick={handleLogout} className='nav-item'>
            <img src={signOutIcon} style={iconStyle} alt="Sign Out" />
          </button>
        </div>
      </div>

      {/* 4. CONTENT WRAPPER */}
      <div className='right-side-wrapper'>
        
        {/* Header */}
        <div className='dashboard-header'>
          <div className='header-search'>
             <div 
               style={{ marginRight: '1rem', cursor: 'pointer' }}
               onClick={() => setIsSidebarOpen(true)} // <-- OPEN SIDEBAR BUTTON
             >
                <RxHamburgerMenu style={{ width: '24px', height: '24px' }} />
             </div>
             <input type="text" placeholder="Search..." className='search-input' />
          </div>

          <div className='header-info-group'>
              <div className='info-block'>
                  <div className='info-title' style={{ color: 'green' }}>ONLINE</div>
                  <div className='info-subtitle'>POS Status</div>
              </div>

              <div className='info-block'>
                  <div className='info-title'>{formatTime(currentDate)}</div>
                  <div className='info-subtitle'>{formatDate(currentDate)}</div>
              </div>

              <div className='user-profile'>
                  <div className='info-block'>
                      <div className='info-title'>{currentUser?.username || 'Admin'}</div>
                      <div className='info-subtitle'>Clocked in at 08:00</div>
                  </div>
                   <div className='user-avatar'>
                      {getTheFirstCharacter(currentUser?.username)}
                  </div>
              </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='main-content-scroll-area'>
            {children}
        </div>
      </div>
    </div>
  );
}

// --- PROTECTED ROUTE ---
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken');
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

// --- APP COMPONENT ---
function App() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const horizontalScale = windowWidth / 1920;
      const verticalScale = windowHeight / 1080;
      const newScale = Math.min(horizontalScale, verticalScale);
      setScale(newScale);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='app-scale-wrapper' style={{ transform: `scale(${scale})` }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ordermenu" element={
            <ProtectedRoute>
              <OrderMenu onBack={() => window.history.back()} />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } />

          <Route path="/items" element={<ProtectedRoute><MainLayout><Items /></MainLayout></ProtectedRoute>} />
          <Route path="/itemtypes" element={<ProtectedRoute><MainLayout><ItemTypes /></MainLayout></ProtectedRoute>} />
          <Route path="/locations" element={<ProtectedRoute><MainLayout><Locations /></MainLayout></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><MainLayout><Customers /></MainLayout></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><MainLayout><Orders /></MainLayout></ProtectedRoute>} />
          <Route path="/orderitems" element={<ProtectedRoute><MainLayout><OrderItems /></MainLayout></ProtectedRoute>} />
          <Route path="/ordertypes" element={<ProtectedRoute><MainLayout><OrderTypes /></MainLayout></ProtectedRoute>} />
          <Route path="/paymentmethods" element={<ProtectedRoute><MainLayout><PaymentMethods /></MainLayout></ProtectedRoute>} />
          <Route path="/roles" element={<ProtectedRoute><MainLayout><Roles /></MainLayout></ProtectedRoute>} />
          <Route path="/creditcards" element={<ProtectedRoute><MainLayout><CreditCards /></MainLayout></ProtectedRoute>} />
          <Route path="/status" element={<ProtectedRoute><MainLayout><Status /></MainLayout></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><MainLayout><Users /></MainLayout></ProtectedRoute>} />
          <Route path="/taxconfig" element={<ProtectedRoute><MainLayout><TaxConfig /></MainLayout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><MainLayout><Settings /></MainLayout></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><MainLayout><Help /></MainLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;