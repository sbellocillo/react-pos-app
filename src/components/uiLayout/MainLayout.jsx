import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useServerStatus from '../../hooks/useServerStatus';

import { RxHamburgerMenu } from "react-icons/rx";
import { TbArrowLeft } from "react-icons/tb";

// Update these paths based on your actual folder structure
import squaredMenuIcon from '../../assets/images/squared-menu.png';
import billIcon from '../../assets/images/bill.png';
import queueIcon from '../../assets/images/queue.png';
import historyIcon from '../../assets/images/history.png';
import graphIcon from '../../assets/images/graph.png';
import settingsIcon from '../../assets/images/settings.png';
import helpIcon from '../../assets/images/help.png';
import signOutIcon from '../../assets/images/sign-out.png';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = useServerStatus();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) setCurrentUser(JSON.parse(userData));
    
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const getPageTitle = (path) => {
    switch (path) {
      case '/checkout': return 'Checkout';
      default: return path.replace('/', '').toUpperCase() || 'DASHBOARD';
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const getTheFirstCharacter = (st) => st ? st.charAt(0).toUpperCase() : "U";

  const isDashboard = location.pathname === '/';
  const isCheckout = location.pathname === '/checkout';

  // --- MENU CONFIGURATION ---
  const sideMenuItems = [
    { id: 'dashboard', label: 'Dashboard',     icon: <img src={squaredMenuIcon} className="nav-icon" alt="" />, path: '/dashboard' },
    { id: 'transactions', label: 'Transactions',  icon: <img src={billIcon} className="nav-icon" alt="" />, path: '/items' },
    { id: 'queuing',   label: 'Queuing',       icon: <img src={queueIcon} className="nav-icon" alt="" />, path: '/queue' },
    { id: 'history',   label: 'Order History', icon: <img src={historyIcon} className="nav-icon" alt="" />, path: '/locations' },
    { id: 'reports',   label: 'Reports',       icon: <img src={graphIcon} className="nav-icon" alt="" />, path: '/customers' },
  ];

  const bottomMenuItems = [
    { id: 'settings',  label: 'Settings',      icon: <img src={settingsIcon} className="nav-icon" alt="" />, path: '/settings' },
    { id: 'help',      label: 'Help',          icon: <img src={helpIcon} className="nav-icon" alt="" />, path: '/help' },
  ];

  return (
    <div className='main-layout-container'>
      {isSidebarOpen && <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)} />}
      
      {/* --- SIDEBAR --- */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        {/* Header / Hamburger */}
        <div className='sidebar-logo'>
          <button onClick={() => setIsSidebarOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}>
            <RxHamburgerMenu size={32} color="#333" />
          </button>
        </div>

        {/* Top Navigation */}
        <nav className='sidebar-nav'>
          {sideMenuItems.map(item => (
            <button 
                key={item.id} 
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <div className='nav-icon-wrapper'>{item.icon}</div>
              <span className='nav-label'>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className='sidebar-bottom-actions'>
           {bottomMenuItems.map(item => (
             <button 
                key={item.id} 
                onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} 
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
             >
               <div className='nav-icon-wrapper'>{item.icon}</div>
               <span className='nav-label'>{item.label}</span>
             </button>
           ))}
           
           <div className='logout-container'>
              <button onClick={handleLogout} className='sidebar-nav-item'>
                <div className='nav-icon-wrapper'>
                  <img src={signOutIcon} className="nav-icon" alt="Sign Out" />
                </div>
                <span className='nav-label'>Logout</span>
            </button>
           </div>
        </div>
      </div>

      {/* --- MAIN CONTENT RIGHT SIDE --- */}
      <div className='right-side-wrapper'>
        <div className='dashboard-header'>
          <div className='header-search'>
             <div style={{ marginRight: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
               onClick={() => isCheckout ? navigate('/dashboard') : setIsSidebarOpen(true)}>
              {isCheckout ? <TbArrowLeft style={{ width: '24px', height: '24px' }} /> : <RxHamburgerMenu style={{ width: '24px', height: '24px' }} />}
             </div>
             {isDashboard ? (
                <input type="text" className="search-input" placeholder=" " /> 
             ) : (
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color:'#300' }}>{getPageTitle(location.pathname)}</h2>
             )}
          </div>
          <div className='header-info-group'>
            <div className="info-block">
              <div className={`pos-status-card ${!isOnline ? 'offline-mode' : ''}`}>
                <span className="signal-bars">
                  <span className={`bar b1 ${!isOnline ? 'gray' : ''}`} />
                  <span className={`bar b2 ${!isOnline ? 'gray' : ''}`} />
                  <span className={`bar b3 ${!isOnline ? 'gray' : ''}`} />
                  <span className={`bar b4 ${!isOnline ? 'gray' : ''}`} />
                  <span className={`bar b5 ${!isOnline ? 'gray' : ''}`} />
                </span>
                <div className="status-text">
                  <div className="info-subtitle">
                    POS Status:
                  </div>
                  {isOnline ? (
                    <div className='info-title online'>ONLINE</div>
                  ) : (
                    <div className='info-title offline' style={{ color: 'red' }}>OFFLINE</div>
                  )}
                </div>
              </div>
            </div>
            <div className='date-time'>
                <div className='info-subtitle'>{formatDate(currentDate)}</div>
                <div className='info-subtitle'>{formatTime(currentDate)}</div>
            </div>
            <div className='user-profile'>
                <div className='info-block'>
                    <div className='info-title'>{currentUser?.username || 'Admin'}</div>
                    <div className='info-subtitle'>Clocked in at {currentUser?.loginTime || '--:--'}</div>
                </div>
                <div className='user-avatar'>{getTheFirstCharacter(currentUser?.username)}</div>
            </div>
          </div>
        </div>
        <div className='main-content-scroll-area'>{children}</div>
      </div>
    </div>
  );
}