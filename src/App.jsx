import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { apiEndpoints } from './services/api';
import './App.css';

// --- ICONS & ASSETS IMPORT ---
import { AiFillAccountBook } from "react-icons/ai";
import {
  TbShoppingCart, TbBox, TbClipboard, TbMapPin, TbUsers, TbFileInvoice,
  TbCash, TbUser, TbBolt, TbReceipt
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

// --- DASHBOARD COMPONENT ---
function Dashboard() {
  const navigate = useNavigate();
  
  // State for Active Category Tab
  const [activeCategory, setActiveCategory] = useState('MEALS');
  const categories = ['MEALS', 'ALA CARTE', 'BEVERAGES', 'SAUCES & ADD-ONS'];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <AiFillAccountBook />, path: '/' },
    { id: 'items', label: 'Items', icon: <TbBox />, path: '/items' },
    { id: 'itemTypes', label: 'Item Types', icon: <TbClipboard />, path: '/itemtypes' },
    { id: 'locations', label: 'Locations', icon: <TbMapPin />, path: '/locations' },
    { id: 'customers', label: 'Customers', icon: <TbUsers />, path: '/customers' },
    { id: 'orders', label: 'Orders', icon: <TbFileInvoice />, path: '/orders' },
    { id: 'orderItems', label: 'Order Items', icon: <TbShoppingCart />, path: '/orderitems' },
    { id: 'orderTypes', label: 'Order Types', icon: <TbClipboard />, path: '/ordertypes' },
    { id: 'paymentMethods', label: 'Payment Methods', icon: <TbCash />, path: '/paymentmethods' },
    { id: 'creditCards', label: 'Credit Cards', icon: <TbCash />, path: '/creditcards' },
    { id: 'roles', label: 'Roles', icon: <TbUsers />, path: '/roles' },
    { id: 'status', label: 'Status', icon: <TbBolt />, path: '/status' },
    { id: 'users', label: 'Users', icon: <TbUser />, path: '/users' },
    { id: 'taxConfig', label: 'Tax Config', icon: <TbReceipt />, path: '/taxconfig' }
  ];

  return (
    <div className='app-container'>
      <h3 className='section-title'>Categories</h3>

      {/* Dynamic Category Tabs */}
      <div className='itm-cat-container'>
        {categories.map((category) => (
          <button 
            key={category} 
            className={`itm-cat-btn ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            <span>{category}</span>
          </button>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className='section-title'>Items</h3>
        <div className='menu-itm-grid'>
          {menuItems.filter(item => item.id !== 'dashboard').map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className='menu-itm-card'
            >
              <span className='card-icon'>{item.icon}</span>
              <span className='card-label'>{item.label}</span>
            </button>
          ))}
        </div>
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