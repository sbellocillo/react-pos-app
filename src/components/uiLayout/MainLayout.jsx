import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useServerStatus from '../../hooks/useServerStatus';

import { RxHamburgerMenu } from "react-icons/rx";
import { TbArrowLeft } from "react-icons/tb";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

// Update these paths based on your actual folder structure
import squaredMenuIcon from '../../assets/images/squared-menu.png';
import billIcon from '../../assets/images/bill.png';
import queueIcon from '../../assets/images/queue.png';
import historyIcon from '../../assets/images/history.png';
import graphIcon from '../../assets/images/graph.png';
import settingsIcon from '../../assets/images/settings.png';
import helpIcon from '../../assets/images/help.png';
import signOutIcon from '../../assets/images/sign-out.png';
import layoutIcon from '../../assets/images/layouticon.png';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isOnline = useServerStatus();
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    const activeItem =
      sideMenuItems.find(i => location.pathname === i.path) ||
      sideMenuItems.find(i => location.pathname.startsWith(i.path + '/'));

    if (activeItem) setSelectedMenuId(activeItem.id);
  }, [location.pathname]);

  const [openMenus, setOpenMenus] = useState({ layout: false });

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) setCurrentUser(JSON.parse(userData));

    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const isOnLayoutRoute = location.pathname.startsWith('/layout');
    setOpenMenus(prev => ({ ...prev, layout: isOnLayoutRoute }));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/');
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

  const toggleMenu = (id) => {
    setOpenMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isPathActive = (path) => location.pathname === path;

  // --- MENU CONFIGURATION ---
  const sideMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <img src={squaredMenuIcon} className="nav-icon" alt="" />, path: '/dashboard' },
    { id: 'transactions', label: 'Transactions', icon: <img src={billIcon} className="nav-icon" alt="" />, path: '/items' },
    { id: 'queuing', label: 'Queuing', icon: <img src={queueIcon} className="nav-icon" alt="" />, path: '/queue' },
    { id: 'history', label: 'Order History', icon: <img src={historyIcon} className="nav-icon" alt="" />, path: '/locations' },
    { id: 'reports', label: 'Reports', icon: <img src={graphIcon} className="nav-icon" alt="" />, path: '/customers' },

    {
      id: 'layout',
      label: 'Layouts',
      icon: <img src={layoutIcon} className="nav-icon" alt="" />,
      path: '/layout',
      children: [
        { id: 'layoutcategory', label: 'Layout Category', path: '/layoutcategory' },
        { id: 'layout-templates', label: 'Layout Templates', path: '/layouts' },
        { id: 'layout-pos', label: 'Layout POS Terminal', path: '/layoutassignment' },
      ]
    },
  ];

  const bottomMenuItems = [
    { id: 'settings', label: 'Settings', icon: <img src={settingsIcon} className="nav-icon" alt="" />, path: '/settings' },
    { id: 'help', label: 'Help', icon: <img src={helpIcon} className="nav-icon" alt="" />, path: '/help' },
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
          {sideMenuItems.map(item => {
            const hasChildren = Array.isArray(item.children) && item.children.length > 0;
            const isParentActive = selectedMenuId === item.id || location.pathname.startsWith(item.path);

            if (!hasChildren) {
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedMenuId(item.id);
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`sidebar-nav-item ${selectedMenuId === item.id ? 'active' : ''}`}
                >
                  <div className='nav-icon-wrapper'>{item.icon}</div>
                  <span className='nav-label'>{item.label}</span>
                </button>
              );
            }

            return (
              <div key={item.id} className="sidebar-dropdown-group">
                <button
                  onClick={() => {
                    setSelectedMenuId(item.id);
                    toggleMenu(item.id);
                  }}
                  className={`sidebar-nav-item ${isParentActive ? 'active' : ''}`}
                >
                  <div className='nav-icon-wrapper'>{item.icon}</div>
                  <span className='nav-label'>{item.label}</span>

                  <span style={{ marginLeft: '7rem', display: 'flex', alignItems: 'center' }}>
                    {openMenus[item.id] ? <IoChevronUp /> : <IoChevronDown />}
                  </span>
                </button>

                {openMenus[item.id] && (
                  <div className="sidebar-submenu">
                    {item.children.map(child => (
                      <button
                        key={child.id}
                        onClick={() => {
                          setSelectedMenuId('layout'); 
                          navigate(child.path);
                          setIsSidebarOpen(false);
                        }}
                        className={`sidebar-submenu-item ${isPathActive(child.path) ? 'active' : ''}`}
                      >
                        <span className="sidebar-submenu-bullet">•</span>
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions & Logout */}
        <div className='sidebar-bottom-actions'>
          {bottomMenuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedMenuId(item.id);
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`sidebar-nav-item ${selectedMenuId === item.id ? 'active' : ''}`}
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
            <div
              style={{ marginRight: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => isCheckout ? navigate('/dashboard') : setIsSidebarOpen(true)}
            >
              {isCheckout ? <TbArrowLeft style={{ width: '24px', height: '24px' }} /> : <RxHamburgerMenu style={{ width: '24px', height: '24px' }} />}
            </div>
            {isDashboard ? (
              <input type="text" className="search-input" placeholder=" " />
            ) : (
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#300' }}>
                {getPageTitle(location.pathname)}
              </h2>
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
                  <div className="info-subtitle">POS Status:</div>
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
