import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillAccountBook } from "react-icons/ai";
import {
  TbShoppingCart, TbBox, TbClipboard, TbMapPin, TbUsers, TbFileInvoice,
  TbCash, TbUser, TbBolt, TbReceipt
} from "react-icons/tb";
import { LuLayoutList } from "react-icons/lu";
import '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <AiFillAccountBook />, path: '/dashboard' },
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
    { id: 'taxConfig', label: 'Tax Config', icon: <TbReceipt />, path: '/taxconfig' },
    { id: 'layout-templates', label: 'Menu Layouts', icon: <LuLayoutList/>, path: '/layouts' },
  ];

  return (
    <div className='dashboard-container'>
      {/* Statistics Cards */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card dashboard-stat-card-sales">
          <h3>Today's Sales</h3>
          <div className="dashboard-stat-value">$1,234.56</div>
          <div className="dashboard-stat-description">+12% from yesterday</div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card-orders">
          <h3>Orders</h3>
          <div className="dashboard-stat-value">45</div>
          <div className="dashboard-stat-description">+8 new orders</div>
        </div>
        <div className="dashboard-stat-card dashboard-stat-card-items">
          <h3>Items Sold</h3>
          <div className="dashboard-stat-value">127</div>
          <div className="dashboard-stat-description">Across all locations</div>
        </div>
      </div>

      {/* Order Menu Button 
      <div className="dashboard-order-menu-wrapper">
        <button onClick={() => navigate('/items')} className="dashboard-order-menu-btn">
          <span>Items</span>
        </button>
        <button onClick={() => navigate('/users')} className="dashboard-order-menu-btn">
          <span>Users</span>
        </button>
        <button onClick={() => navigate('/locations')} className="dashboard-order-menu-btn">
          <span>locations</span>
        </button>
        <button onClick={() => navigate('/ordermenu')} className="dashboard-order-menu-btn">
          <span>Order Menu</span>
        </button>
      </div>
      */}

      {/* Quick Access Menu */}
      <div className="dashboard-quick-access">
        <h3 className="dashboard-quick-access-title">Quick Access Menu</h3>
        <div className="dashboard-quick-access-grid">
          {menuItems.filter(item => item.id !== 'dashboard').map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="dashboard-menu-card"
            >
              <span className="dashboard-menu-card-icon">{item.icon}</span>
              <span className="dashboard-menu-card-label">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
