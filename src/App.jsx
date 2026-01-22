import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

// Layouts & Pages
import MainLayout from './components/uiLayout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Checkout from './pages/Checkout';

// Other Pages
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
import Settings from './pages/Settings';
import Help from './pages/Help';
import Queue from './pages/Queue';
import Layouts from './pages/Layouts';
import LayoutAssignment from './pages/LayoutAssignment';
import LayoutCategory from './pages/LayoutCategory';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace/>
  }
  return children;
}

function App() {
  return (
    <div className='app-scale-wrapper'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/ordermenu" element={<ProtectedRoute><OrderMenu onBack={() => window.history.back()} /></ProtectedRoute>} />
            
            <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />

<<<<<<< HEAD
          {/* Standard Pages wrapped in MainLayout */}
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
          <Route path="/checkout" element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><MainLayout><Queue /></MainLayout></ProtectedRoute>} />
          <Route path="/layouts" element={<ProtectedRoute><MainLayout><Layouts /></MainLayout></ProtectedRoute>} />
          <Route path="/layoutassignment" element={<ProtectedRoute><MainLayout><LayoutAssignment /></MainLayout></ProtectedRoute>} />
          <Route path="/layoutcategory" element={<ProtectedRoute><MainLayout><LayoutCategory /></MainLayout></ProtectedRoute>} />
        </Routes>
=======
            {/* Standard Pages wrapped in MainLayout */}
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
            <Route path="/checkout" element={<ProtectedRoute><MainLayout><Checkout /></MainLayout></ProtectedRoute>} />
            <Route path="/queue" element={<ProtectedRoute><MainLayout><Queue /></MainLayout></ProtectedRoute>} />
            <Route path="/layouts" element={<ProtectedRoute><MainLayout><Layouts /></MainLayout></ProtectedRoute>} />
            <Route path="/layoutassignment" element={<ProtectedRoute><MainLayout><LayoutAssignment /></MainLayout></ProtectedRoute>} />
          </Routes>
        </AuthProvider>
>>>>>>> 6d86142a4fd0eb4ebadd01641306a4d482e389a2
      </Router>
    </div>
  );
}

export default App;