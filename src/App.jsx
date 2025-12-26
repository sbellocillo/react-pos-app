import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import ItemTypes from './pages/ItemTypes';
import Items from './pages/Items';
import Locations from './pages/Locations';
import Customers from './pages/Customers';
import OrderTypes from './pages/OrderTypes';
import PaymentMethods from './pages/PaymentMethods';
import Roles from './pages/Roles';
import CreditCards from './pages/CreditCards';
import Status from './pages/Status';
import TaxConfig from './pages/TaxConfig';
import Users from './pages/Users';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import OrderMenu from './pages/OrderMenu';
import Login from './pages/Login';
import { AiFillAccountBook } from "react-icons/ai";
import {
  TbShoppingCart, TbBox, TbClipboard, TbMapPin, TbUsers, TbFileInvoice,
  TbCash, TbUser, TbBolt, TbReceipt
} from "react-icons/tb";

import { TfiLayoutGrid3 } from "react-icons/tfi";
import { IoReceiptOutline } from "react-icons/io5";
import { FaClockRotateLeft } from "react-icons/fa6";
import { GoGraph } from "react-icons/go";
import { RxHamburgerMenu } from "react-icons/rx";


let objCurrentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
      console.log("1 Current User:", JSON.parse(userData));
      objCurrentUser = JSON.parse(userData);
      if (objChecker(objCurrentUser) == false) {
        console.log("Invalid user data, redirecting to login.");
        navigate('/login');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  let objChecker = (obj) => {
    for (let i in obj) {
      return true;
    }
    return false;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <AiFillAccountBook />, path: '/' },
    //  { id: 'orderMenu', label: 'Order Menu', icon: <TbShoppingCart />, path: '/ordermenu' },
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
    <div>
      {/* User Info Header */}
      <div style={{
        background: 'linear-gradient(135deg, #9b0000ff 0%, #f70000ff 100%)',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>RIBSHACK POS Dashboard</h2>
            {currentUser && (
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
                Welcome, {currentUser.username} | {currentUser.role_name} | {currentUser.location_name}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Order Menu Button */}
      <div style={{ marginTop: '2rem', marginBottom: '3rem' }}>
        <button
          onClick={() => navigate('/ordermenu')}
          style={{
            background: 'linear-gradient(135deg, #9b0000ff 0%, #f70000ff 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '1.5rem 3rem',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s ease',
            margin: '0 auto',
            minWidth: '300px',
            justifyContent: 'center'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 15px 35px rgba(139, 92, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 10px 25px rgba(139, 92, 246, 0.3)';
          }}
        >
          <span>Order Menu</span>
        </button>
      </div>

      {/* Quick Access Menu */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Quick Access Menu</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '3rem'
        }}>
          {menuItems.filter(item => item.id !== 'dashboard').map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: '120px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.borderColor = '#dc2626';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 15px rgba(220, 38, 38, 0.1)';
              }}
              onMouseOut={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '2rem' }}>{item.icon}</span>
              <span style={{ color: '#1e293b' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#4f46e5', marginBottom: '1rem' }}>Today's Sales</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>$1,234.56</div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>+12% from yesterday</div>
        </div>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#10b981', marginBottom: '1rem' }}>Orders</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>45</div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>+8 new orders</div>
        </div>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#f59e0b', marginBottom: '1rem' }}>Items Sold</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>127</div>
          <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Across all locations</div>
        </div>
      </div>
    </div>
  );
}

let getTheFirstCharacter = (st) => {
  if (!st) return "A";
  return st.charAt(0).toUpperCase();
}

// --- MAIN LAYOUT (Fixed Sidebar + Scrollable Content + Centered Icons) ---
function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Unified icon style
  const iconStyle = { width: '30px', height: '30px' };

  const menuItems = [
    { id: 'dashboard', icon: <TfiLayoutGrid3 style={iconStyle} />, path: '/' },
    { id: 'items', icon: <IoReceiptOutline style={iconStyle} />, path: '/items' },
    { id: 'itemTypes', icon: <TbUsers style={iconStyle} />, path: '/itemtypes' },
    { id: 'locations', icon: <FaClockRotateLeft style={iconStyle} />, path: '/locations' },
    { id: 'customers', icon: <GoGraph style={iconStyle} />, path: '/customers' },
    // Add other items here...
  ];

  return (
    // 1. OUTER CONTAINER: Fixed to 100vh, Hidden overflow prevents whole page scroll
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      overflow: 'hidden', 
      background: '#f1f5f9' 
    }}>
      
      {/* 2. LEFT SIDEBAR: Stays fixed full height */}
      <div style={{
        width: '100px', // Compact width
        background: 'white',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{
          padding: '10px',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <RxHamburgerMenu style={{ width: '30px', height: '30px', margin: '10px 0' }} />
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderLeft = '4px solid #ef4444';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.borderLeft = '4px solid transparent';
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center', // Centers the icon horizontally
                  padding: '15px 0',
                  
                  // Active State Logic
                  background: isActive ? '#fef2f2' : 'transparent',
                  color: isActive ? '#ef4444' : '#6b7280',
                  border: 'none',
                  borderLeft: isActive ? '4px solid #ef4444' : '4px solid transparent',
                  
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{item.icon}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom User Section */}
        <div style={{
          padding: '1.5rem 0',
          borderTop: '1px solid #e5e7eb',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>{getTheFirstCharacter(objCurrentUser.username)}</div>

          <button
            onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('currentUser');
              window.location.href = '/login';
            }}
            style={{
              width: '50%',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              display: 'flex',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = '#dc2626'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#ef4444'; }}
          >
            🚪
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT: Independent Scroll Area */}
      <div style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto', // Enables vertical scrolling here only
        padding: '2rem'
      }}>
        <div style={{
          background: '#f1f5f9',
          minHeight: '100%',
          borderRadius: '12px'
        }}>
          <div style={{
            background: 'white',
            margin: '0',
            padding: '2rem',
            borderRadius: '12px',
            // Ensure content area is at least full height minus margins
            minHeight: 'calc(100% - 2rem)', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('authToken');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
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
        <Route path="/items" element={
          <ProtectedRoute>
            <MainLayout>
              <Items />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/itemtypes" element={
          <ProtectedRoute>
            <MainLayout>
              <ItemTypes />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/locations" element={
          <ProtectedRoute>
            <MainLayout>
              <Locations />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/customers" element={
          <ProtectedRoute>
            <MainLayout>
              <Customers />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <MainLayout>
              <Orders />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/orderitems" element={
          <ProtectedRoute>
            <MainLayout>
              <OrderItems />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/ordertypes" element={
          <ProtectedRoute>
            <MainLayout>
              <OrderTypes />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/paymentmethods" element={
          <ProtectedRoute>
            <MainLayout>
              <PaymentMethods />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/roles" element={
          <ProtectedRoute>
            <MainLayout>
              <Roles />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/creditcards" element={
          <ProtectedRoute>
            <MainLayout>
              <CreditCards />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/status" element={
          <ProtectedRoute>
            <MainLayout>
              <Status />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/taxconfig" element={
          <ProtectedRoute>
            <MainLayout>
              <TaxConfig />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;