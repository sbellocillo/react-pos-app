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
  TbEdit   
} from "react-icons/tb";
import { GoGraph } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";

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


// --- UTILS ---
let objCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

let getTheFirstCharacter = (st) => {
  if (!st) return "U";
  return st.charAt(0).toUpperCase();
}

// --- ORDER BILL COMPONENT ---
function OrderBillPanel() {
    return (
        <div className='bill-panel'>
            {/* Header */}
            <div className='bill-header'>
                <h2 className='bill-title'>New Order Bill</h2>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <TbDots size={24} color="#9ca3af" />
                </button>
            </div>

            {/* Order Type Toggles */}
            <div className='order-type-group'>
                <button className='order-type-btn active'>
                    <TbToolsKitchen2 size={18} /> Dine In
                </button>
                <button className='order-type-btn'>
                    <TbShoppingBag size={18} /> Takeout
                </button>
                <button className='order-type-btn'>
                    <TbTruckDelivery size={18} /> Delivery
                </button>
            </div>

            {/* Info Grid */}
            <div className='bill-info-grid'>
                <span>Order Number</span> <span className='bill-info-value'>#00123</span>
                <span>Date</span> <span className='bill-info-value'>10/25/2023</span>
                <span>Time</span> <span className='bill-info-value'>12:45 PM</span>
                <span>Cashier</span> <span className='bill-info-value'>Jane Doe</span>
            </div>

            {/* Ordered Items List */}
            <h3 className='bill-items-header'>Ordered Items</h3>
            <div className='bill-items-list'>
                {/* Mock Item 1 */}
                <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Korean Spicy Pork</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 250.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
                
                {/* Mock Item 2 */}
                <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>2</div>
                        <span className='bill-item-name'>Cucumber Lemonade</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 180.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 3 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 4 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 5 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 6 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 7 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                 {/* Mock Item 8 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Mock Item 9 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Mock Item 10 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Mock Item 11 */}
                 <div className='bill-item-row'>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <div className='bill-item-qty'>1</div>
                        <span className='bill-item-name'>Kimchi Side</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className='bill-item-price'>₱ 50.00</span>
                        <TbEdit size={16} color="#9ca3af" style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            </div>

            {/* Footer Summary */}
            <div style={{ marginTop: 'auto' }}>
                <div className='bill-summary'>
                    <div className='summary-row'>
                        <span>Sub Total</span>
                        <span>₱ XX.XX</span>
                    </div>
                    <div className='summary-row'>
                        <span>Discount</span>
                        <span>₱ XX.XX</span>
                    </div>
                    <div className='summary-row'>
                        <span>Tax</span>
                        <span>₱ XX.XX</span>
                    </div>
                </div>

                <button className='pay-button'>
                    ₱ XXXX.XX
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
  
  // Fetch Layouts
  useEffect (() => {
    const fetchLayouts = async () => {
      try {
        const response = await apiEndpoints.layouts.getAll();
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
                        onClick={() => console.log("Clicked item:", pos.item_name)}
                        >
                        <span className='card-label'>{pos.item_name || "Unknown Item"}</span>
                        </button>
                    ))}
                    </div>
                </div>
            </div>
            
            {/* RIGHT SIDE: Bill Panel */}
            <OrderBillPanel />
            
        </div>
    </div>
  );
}

// --- MAIN LAYOUT COMPONENT ---
function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
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
           <button onClick={() => navigate('/')} className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
             <img src={settingsIcon} style={iconStyle} alt="Settings" />
           </button>
           <button onClick={() => navigate('/')} className='nav-item'>
             <img src={helpIcon} style={iconStyle} alt="Help" />
           </button>
        </div>

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
                  <div className='info-title'>12:45 PM</div>
                  <div className='info-subtitle'>Oct 25, 2023</div>
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;