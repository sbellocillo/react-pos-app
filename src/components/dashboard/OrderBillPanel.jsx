import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbDots, TbToolsKitchen2, TbShoppingBag, TbTruckDelivery } from "react-icons/tb";
import { apiEndpoints } from '../../services/api';

// Import the separated Modals
import OptionsModal from './modals/OptionsModal';
import TableModal from './modals/TableModal';
import DiscountModal from './modals/DiscountModal';
import QuantityModal from './modals/QuantityModal';

// Import the new CSS file
import './styles/OrderBillPanel.css';

export default function OrderBillPanel({ 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  orderType, 
  setOrderType, 
  totals, 
  isProcessing, 
  onClearCart,
  // Discount Props
  discountType, setDiscountType,
  discountValue, setDiscountValue,
  isSenior, setIsSenior,
  isPWD, setIsPWD,
  orderNote, setOrderNote,
}) {
  const navigate = useNavigate();
  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;
  
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const locationId = currentUser.location_id;
  const currentPosNum = localStorage.getItem('pos_terminal_number') || '1';

  // --- LOCAL STATE ---
  const [activeModalView, setActiveModalView] = useState(null); // 'menu' or 'note'
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nextOrderNum, setNextOrderNum] = useState('...');
  const [tableNumber, setTableNumber] = useState(null);

  // --- EFFECTS ---
  useEffect(() => {
    const fetchNextNumber = async () => {
      // 1. Define a unique key for this terminal's counter
      const storageKey = `offline_sequence_counter_${currentPosNum}`;

      try {
        // 2. Try fetching from Server
        const response = await apiEndpoints.orders.getNextNumber(locationId, currentPosNum);
        
        if (response.data?.success) {
          const orderNum = response.data.nextNumber;
          setNextOrderNum(orderNum);
          
          // ONLINE SUCCESS: Sync local memory to match server
          localStorage.setItem(storageKey, orderNum);
        }
      } catch (error) {
        console.warn("⚠️ Offline: Loading locally saved order number...");

        // 3. OFFLINE FALLBACK: Read from Browser Memory
        const localNum = localStorage.getItem(storageKey);

        if (localNum) {
          setNextOrderNum(localNum);
        } else {
          // 4. FIRST TIME SETUP: Default to "1-1000" if memory is empty
          setNextOrderNum(100);
          localStorage.setItem(storageKey, 100);
        }
      }
    };

    fetchNextNumber();
    
    // Add cartItems to dependency so it refreshes after checkout
  }, [cartItems, locationId, currentPosNum]);

  // --- HANDLERS ---
  const handleOptionAction = (action) => {
    switch (action) {
      case 'newOrder':
      case 'cancelOrder':
        if (onClearCart) onClearCart();
        setActiveModalView(null);
        break;
      case 'addOrderNote':
        setActiveModalView('note');
        break;
      case 'voidOrder':
        if (window.confirm("Are you sure you want to VOID the entire order?")) {
          if (onClearCart) onClearCart();
          setActiveModalView(null);
        }
        break;
      default:
        alert(`${action} not implemented.`);
        setActiveModalView(null);
    }
  };

  const handleTableConfirm = () => {
    setIsTableModalOpen(false);
    navigate('/checkout', { 
        state: { cartItems, totals, orderType, orderNote, tableNumber } 
    });
  };

  const handleItemClick = (item) => {
      setSelectedItem(item);
      setIsQuantityModalOpen(true);
  };

  return (
    <>
      <div className='bill-panel'>
        {/* --- BILL HEADER --- */}
        <div className='bill-header'>
          <h2 className='bill-title'>New Order Bill</h2>
          <button 
            className='options-btn'
            onClick={() => setActiveModalView('menu')} 
          >
            <TbDots size={40} color="#000" />
          </button>
        </div>

        {/* --- ORDER TYPE TOGGLES --- */}
        <div className='order-type-group'>
          {[ 
            { id: 1, label: 'Dine In', icon: <TbToolsKitchen2 size={18} />}, 
            { id: 2, label: 'Takeout', icon: <TbShoppingBag size={18}/>}, 
            { id: 3, label: 'Delivery', icon: <TbTruckDelivery size={18}/>} 
          ].map((type) => (
            <button 
              key={type.id} 
              className={`order-type-btn ${orderType === type.id ? 'active' : ''}`} 
              onClick={() => setOrderType(type.id)}
            >
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        {/* --- INFO GRID --- */}
        <div className='bill-info-grid'>
          <span className='bill-info-label'>Order Number</span> 
          <span className='bill-info-value'>{nextOrderNum}</span>
          
          <span className='bill-info-label'>Date</span> 
          <span className='bill-info-value'>{new Date().toLocaleDateString()}</span>
          
          <span className='bill-info-label'>Time</span> 
          <span className='bill-info-value'>{new Date().toLocaleTimeString()}</span>
          
          <span className='bill-info-label'>Cashier</span> 
          <span className='bill-info-value'>{currentUser?.username || 'Admin'}</span>
        </div>

        {/* --- ITEMS LIST --- */}
        <h3 className='bill-items-header'>Ordered Items</h3>
        <div className='bill-items-list'>
          {cartItems.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999'}}>No items added</div>
          ) : (
            cartItems.map((item, index) => (
              <div 
                className='bill-item-row' 
                key={`${item.id}-${index}`}
                onClick={() => handleItemClick(item)}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 2, minWidth: 0}}>
                  <div className='bill-item-qty'>
                    {item.quantity}
                  </div>
                  <span className='bill-item-name'>{item.item_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span className='bill-item-price'>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- SUMMARY FOOTER --- */}
        <div style={{ marginTop: 'auto' }}>
          <div className='bill-summary'>
            <div className='summary-row'>
              <span>Sub Total</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className='summary-row'>
              <span 
                onClick={() => setIsDiscountModalOpen(true)} 
                style={{cursor:'pointer'}}
              >
                Discount
              </span>
              <span>{totals.discount > 0 ? `-${formatCurrency(totals.discount)}` : '₱ 0.00'}</span>
            </div>
            <div className='summary-row'>
              <span>Tax</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
          </div>
          <button 
            className='pay-button' 
            onClick={() => setIsTableModalOpen(true)} 
            disabled={isProcessing || cartItems.length === 0} 
          >
            {isProcessing ? 'PROCESSING...' : formatCurrency(totals.total)}
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {activeModalView && (
        <OptionsModal 
          activeView={activeModalView}
          onClose={() => setActiveModalView(null)}
          onAction={handleOptionAction}
          noteValue={orderNote}
          setNoteValue={setOrderNote}
          onSaveNote={() => setActiveModalView(null)}
        />
      )}

      <TableModal 
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        onConfirm={handleTableConfirm}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
      />

      <DiscountModal 
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountValue={discountValue}
        setDiscountValue={setDiscountValue}
        isSenior={isSenior}
        setIsSenior={setIsSenior}
        isPWD={isPWD}
        setIsPWD={setIsPWD}
        orderNote={orderNote}
        setOrderNote={setOrderNote}
      />

      <QuantityModal 
        isOpen={isQuantityModalOpen}
        onClose={() => setIsQuantityModalOpen(false)}
        item={selectedItem}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
      />
    </>
  );
}