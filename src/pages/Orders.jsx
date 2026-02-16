import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import OrdersFilterBar from '../components/orders/OrdersFilterBar';
import OrdersTable from '../components/orders/OrdersTable';
import OrdersPagination from '../components/orders/OrdersPagination';
import OrdersModal from '../components/orders/OrdersModal';
import '../styles/orders.css';

const Orders = () => {
  // 1. Data States
  const [orders, setOrders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [orderTypes, setOrderTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  
  // 2. UI States
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  // 3. Filter & Pagination States
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);

  // Note: Place your sampleData arrays here as fallback if needed...

 useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Fetch all data simultaneously
        const [
          ordersRes,
          locationsRes,
          orderTypesRes,
          statusesRes,
          paymentMethodsRes,
          rolesRes,
          customersRes,
          usersRes
        ] = await Promise.all([
          apiEndpoints.orders.getAll(),
          apiEndpoints.locations.getAll(),
          apiEndpoints.orderTypes.getAll(),
          apiEndpoints.status.getAll(),
          apiEndpoints.paymentMethods.getAll(),
          apiEndpoints.roles.getAll(),
          apiEndpoints.customers.getAll(),
          apiEndpoints.users.getAll()
        ]);

        // 2. Set the state with the response data
        // Note: I'm using .data.data here based on your original code, 
        // but if your API just returns the array directly, you might just need .data
        setOrders(ordersRes.data.data || []);
        setLocations(locationsRes.data.data || []);
        setOrderTypes(orderTypesRes.data.data || []);
        setStatuses(statusesRes.data.data || []);
        setPaymentMethods(paymentMethodsRes.data.data || []);
        setRoles(rolesRes.data.data || []);
        setCustomers(customersRes.data.data || []);
        setUsers(usersRes.data.data || []);

      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    loadData();
  }, []);

  // --- Handlers ---
  const handleCreate = () => {
    setEditingOrder(null);
    setShowModal(true);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      setOrders(orders.filter(order => order.id !== id));
    }
  };

  const handleSaveOrder = (formData) => {
    // Validation check
    if (!formData.customer_id || !formData.user_id || !formData.subtotal) {
      alert('Please fill in all required fields');
      return;
    }

    // Process and save data logic (building your orderData object here)
    // ...

    setShowModal(false);
  };

  const handleClearFilters = () => {
    setDateFrom('');
    setDateTo('');
    setSelectedLocation('');
  };

  // --- Derived State (Filtering & Pagination) ---
  const filteredOrders = orders.filter(order => {
    if (dateFrom || dateTo) {
      const orderDate = new Date(order.order_date);
      const fromD = dateFrom ? new Date(dateFrom) : null;
      const toD = dateTo ? new Date(dateTo + 'T23:59:59') : null;
      if (fromD && orderDate < fromD) return false;
      if (toD && orderDate > toD) return false;
    }
    if (selectedLocation && order.location_id !== parseInt(selectedLocation)) return false;
    return true;
  });

  const totalAmount = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset page on filter change
  }, [dateFrom, dateTo, selectedLocation]);

  return (
    <div className="orders-container">
      <div className="orders-header-row">
        <h2 className="orders-title">Orders Management</h2>
        <button onClick={handleCreate} className="orders-btn-success">
          Create Order
        </button>
      </div>

      <OrdersFilterBar 
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
        locations={locations}
        onClear={handleClearFilters}
        totalOrders={filteredOrders.length}
        totalAmount={totalAmount}
      />
      
      <div>Total Records: {orders.length}</div>
      
      <div className="orders-table-card">
        <OrdersTable 
          orders={currentOrders} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
       <OrdersPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={startIndex + itemsPerPage}
          totalItems={filteredOrders.length}
          onPageChange={setCurrentPage}
        />

      <OrdersModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveOrder}
        editingOrder={editingOrder}
        customers={customers}
        users={users}
        statuses={statuses}
        orderTypes={orderTypes}
        locations={locations}
        roles={roles}
        paymentMethods={paymentMethods}
      />
    </div>
  );
};

export default Orders;