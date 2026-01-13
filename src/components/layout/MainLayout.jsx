import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
      default: return path.replace('/', '').toUpperCase();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const getTheFirstCharacter = (st) => st ? st.charAt(0).toUpperCase() : "U";

  const isDashboard = location.pathname === '/';
  const isCheckout = location.pathname === '/checkout';
  const iconStyle = { width: '30px', height: '30px' };

  const sideMenuItems = [
    { id: 'dashboard', icon: <img src={squaredMenuIcon} style={iconStyle} alt="Dashboard" />, path: '/' },
    { id: 'items', icon: <img src={billIcon} style={iconStyle} alt="Items" />, path: '/items' },
    { id: 'queue', icon: <img src={queueIcon} style={iconStyle} alt="Types" />, path: '/queue' },
    { id: 'locations', icon: <img src={historyIcon} style={iconStyle} alt="Locations" />, path: '/locations' },
    { id: 'customers', icon: <img src={graphIcon} style={iconStyle} alt="Customers" />, path: '/customers' },
  ];

  return (
    <div className='main-layout-container'>
      {isSidebarOpen && <div className='sidebar-overlay' onClick={() => setIsSidebarOpen(false)} />}
      
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className='sidebar-logo'>
          <button onClick={() => setIsSidebarOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <RxHamburgerMenu style={{ width: '28px', height: '28px', color: '#333' }} />
          </button>
        </div>
        <nav className='sidebar-nav'>
          {sideMenuItems.map(item => (
            <button key={item.id} onClick={() => { navigate(item.path); setIsSidebarOpen(false); }} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
              <span>{item.icon}</span>
            </button>
          ))}
        </nav>
        <div className='sidebar-bottom-actions'>
           <button onClick={() => { navigate('/settings'); setIsSidebarOpen(false); }} className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
             <img src={settingsIcon} style={iconStyle} alt="Settings" />
           </button>
           <button onClick={() => { navigate('/help'); setIsSidebarOpen(false); }} className='nav-item'>
             <img src={helpIcon} style={iconStyle} alt="Help" />
           </button>
        </div>
        <div className='sidebar-footer'>
          <button onClick={handleLogout} className='nav-item'>
            <img src={signOutIcon} style={iconStyle} alt="Sign Out" />
          </button>
        </div>
      </div>

      <div className='right-side-wrapper'>
        <div className='dashboard-header'>
          <div className='header-search'>
             <div style={{ marginRight: '2rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
               onClick={() => isCheckout ? navigate('/') : setIsSidebarOpen(true)}>
              {isCheckout ? <TbArrowLeft style={{ width: '24px', height: '24px' }} /> : <RxHamburgerMenu style={{ width: '24px', height: '24px' }} />}
             </div>
             {isDashboard ? <input type="text" className="search-input" placeholder=" " /> : <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color:'#300' }}>{getPageTitle(location.pathname)}</h2>}
          </div>
          <div className='header-info-group'>
            <div className="info-block">
              <div className="pos-status-card">
                <span className="signal-bars"><span className="bar b1" /><span className="bar b2" /><span className="bar b3" /><span className="bar b4" /><span className="bar b5" /></span>
                <div className="status-text"><div className="info-subtitle">POS Status:</div><div className="info-title online">ONLINE</div></div>
              </div>
            </div>
            <div className='date-time'>
                <div className='info-subtitle'>{formatDate(currentDate)}</div>
                <div className='info-subtitle'>{formatTime(currentDate)}</div>
            </div>
            <div className='user-profile'>
                <div className='info-block'>
                    <div className='info-title'>{currentUser?.username || 'Admin'}</div>
                    <div className='info-subtitle'>Clocked in at 08:00</div>
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