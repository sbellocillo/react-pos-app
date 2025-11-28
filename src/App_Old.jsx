import { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ItemTypes from './pages/ItemTypes';
import Items from './pages/Items';
import Locations from './pages/Locations';
import OrderTypes from './pages/OrderTypes';
import PaymentMethods from './pages/PaymentMethods';
import Roles from './pages/Roles';
import Status from './pages/Status';
import TaxConfig from './pages/TaxConfig';
import Users from './pages/Users';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import OrderMenu from './pages/OrderMenu';

function App() {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orderMenu', label: 'Order Menu', icon: '🛒' },
    { id: 'items', label: 'Items', icon: '🛍️' },
    { id: 'itemTypes', label: 'Item Types', icon: '📋' },
    { id: 'locations', label: 'Locations', icon: '📍' },
    { id: 'orders', label: 'Orders', icon: '📝' },
    { id: 'orderItems', label: 'Order Items', icon: '🛒' },
    { id: 'orderTypes', label: 'Order Types', icon: '📄' },
    { id: 'paymentMethods', label: 'Payment Methods', icon: '💳' },
    { id: 'roles', label: 'Roles', icon: '👥' },
    { id: 'status', label: 'Status', icon: '⚡' },
    { id: 'users', label: 'Users', icon: '👤' },
    { id: 'taxConfig', label: 'Tax Config', icon: '🧾' }
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div>
            <h2>Dashboard</h2>

            {/* Quick Access Menu */}
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Quick Access Menu</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '3rem'
              }}>
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
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

      case 'items':
        return <Items />;
      case 'itemTypes':
        return <ItemTypes />;
      case 'locations':
        return <Locations />;
      case 'orders':
        return <Orders />;
      case 'orderItems':
        return <OrderItems />;
      case 'orderTypes':
        return <OrderTypes />;
      case 'paymentMethods':
        return <PaymentMethods />;
      case 'roles':
        return <Roles />;
      case 'status':
        return <Status />;
      case 'taxConfig':
        return <TaxConfig />;
      case 'users':
        return <Users />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>{menuItems.find(item => item.id === activeMenu)?.label}</h2>
            <p style={{ color: '#6b7280', marginTop: '1rem' }}>This section is under development.</p>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: '2rem',
              maxWidth: '600px',
              margin: '2rem auto'
            }}>
              <h3>Coming Soon</h3>
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>
                The {menuItems.find(item => item.id === activeMenu)?.label} module will include comprehensive management features for your POS system.
              </p>
            </div>
          </div>
        );
    }
  };

  // If orderMenu is active, render it full-screen without dashboard layout
  if (activeMenu === 'orderMenu') {
    return <OrderMenu onBack={() => setActiveMenu('dashboard')} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Left Sidebar */}
      <div style={{
        width: '280px',
        background: 'white',
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <img src="https://8932109.app.netsuite.com/core/media/media.nl?id=65916&c=8932109&h=yVp7zmJXhqC031gbC_N9zx3FZJPxQ_D-_AyBKYfYnen0vK7f" alt="RIBSHACK Logo" style={{ width: '70px', height: '60px', marginBottom: '0.5rem' }} />
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0
          }}>RIBSHACK POS</h1>
        </div>

        {/* Navigation Menu */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.background = '#fef2f2';
                  e.target.style.color = '#ef4444';
                  e.target.style.borderLeft = '4px solid #ef4444';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#6b7280';
                  e.target.style.borderLeft = '4px solid transparent';
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '1rem 2rem',
                background: activeMenu === item.id ? '#fef2f2' : 'transparent',
                border: 'none',
                borderLeft: activeMenu === item.id ? '4px solid #ef4444' : '4px solid transparent',
                color: activeMenu === item.id ? '#ef4444' : '#6b7280',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeMenu === item.id ? '600' : '400',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <span style={{ marginRight: '1rem', fontSize: '1.2rem' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              marginRight: '1rem'
            }}>U</div>
            <div>
              <div style={{ fontWeight: '600', color: '#1e293b' }}>Admin User</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>admin@ribshack.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto'
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
            minHeight: 'calc(100vh - 8rem)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;