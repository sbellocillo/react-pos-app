import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbDots, TbX, TbToolsKitchen2, TbShoppingBag, TbTruckDelivery, TbMinus, TbPlus } from "react-icons/tb";

export default function OrderBillPanel({ 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  orderType, 
  setOrderType, 
  totals, 
  isProcessing, 
  onClearCart,
  // --- DISCOUNT PROPS ---
  discountType,
  setDiscountType,
  discountValue,
  setDiscountValue,
  isSenior,
  setIsSenior,
  isPWD,
  setIsPWD,
  orderNote,
  setOrderNote
}) {
  const navigate = useNavigate();
  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  // Local UI State
  const [activeModalView, setActiveModalView] = useState(null); // 'menu' or 'note'
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [tableNumber, setTableNumber] = useState(0);

  // --- HANDLERS ---
  const handleOptionClick = (action) => {
    switch (action) {
      case 'newOrder':
      case 'cancelOrder':
        if (onClearCart) onClearCart();
        setActiveModalView(null);
        break;
      case 'addOrderNote':
        setActiveModalView('note');
        break;
      default:
        alert(`${action} functionality not yet implemented.`);
        setActiveModalView(null);
        break;
    }
  };

  const handleSeniorToggle = (e) => {
    const checked = e.target.checked;
    setIsSenior(checked);
    if (checked) {
      setIsPWD(false); // Mutually exclusive
      setDiscountValue(0); // Reset manual discount
      setDiscountType('PERCENTAGE'); 
      setOrderNote('Senior Citizen Discount');
    } else {
      setOrderNote('')
    }
  };

  const handlePWDToggle = (e) => {
    const checked = e.target.checked;
    setIsPWD(checked);
    if (checked) {
      setIsSenior(false); // Mutually exclusive
      setDiscountValue(0); // Reset manual discount
      setDiscountType('PERCENTAGE');
      setOrderNote('PWD Discount');
    } else {
      setOrderNote('')
    }
  };

  // UPDATED: Logic to toggle On/Off
  const handlePresetClick = (val) => {
    // If the clicked value is already active (and not overriden by Senior/PWD), toggle it off
    if (discountValue === val && !isSenior && !isPWD) {
      setDiscountValue(0);
    } else {
      // Otherwise, activate it
      setDiscountType('PERCENTAGE');
      setDiscountValue(val);
      setIsSenior(false);
      setIsPWD(false);
    }
  };

  return (
    <>
      <div className='bill-panel'>
        {/* --- BILL HEADER --- */}
        <div className='bill-header'>
          <h2 className='bill-title'>New Order Bill</h2>
          <button 
            onClick={() => setActiveModalView('menu')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '40px' }}
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
          <span className='bill-info-label'>Order Number</span> <span className='bill-info-value'>#NEW</span>
          <span className='bill-info-label'>Date</span> <span className='bill-info-value'>{new Date().toLocaleDateString()}</span>
          <span className='bill-info-label'>Time</span> <span className='bill-info-value'>{new Date().toLocaleTimeString()}</span>
          <span className='bill-info-label'>Cashier</span> <span className='bill-info-value'>{currentUser?.username || 'Admin'}</span>
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
                onClick={() => {
                  setSelectedItem(item);
                  setIsQuantityModalOpen(true);
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 2, minWidth: 0}}>
                  <div 
                    className='bill-item-qty' 
                    style={{cursor: 'pointer'}}
                  >
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
            style={{ opacity: isProcessing ? 0.7 : 1}}
          >
            {isProcessing ? 'PROCESSING...' : formatCurrency(totals.total)}
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* --- 1. OPTIONS & NOTE MODAL --- */}
      {activeModalView && (
        <>
          <div className="modal-overlay" onClick={() => setActiveModalView(null)} />
          <div className="options-modal" style={activeModalView === 'note' ? { width: '445px', height: '535px' } : {}}>
            
            {activeModalView === 'menu' && (
              <>
                <h3 className="options-header">OPTIONS</h3>
                <ul className="options-list">
                  <li><button onClick={() => handleOptionClick('newOrder')}>New Order</button></li>
                  <li><button onClick={() => handleOptionClick('voidOrder')}>Void Order</button></li>
                  <li><button onClick={() => handleOptionClick('splitBill')}>Split Bill</button></li>
                  <li><button onClick={() => handleOptionClick('cancelOrder')}>Cancel Order</button></li>
                  <li><button onClick={() => handleOptionClick('reportIssue')}>Report Issue</button></li>
                  <li><button onClick={() => handleOptionClick('addOrderNote')}>Add Order Note</button></li>
                </ul>
              </>
            )}

            {activeModalView === 'note' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                   <button onClick={() => setActiveModalView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><TbX size={24} color="#666" /></button>
                   <h3 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '18px', fontWeight: '700', color: '#333' }}>Add Order Note</h3>
                   <div style={{ width: '24px' }}></div>
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <textarea 
                    value={orderNote} 
                    onChange={(e) => setOrderNote(e.target.value)} 
                    placeholder="Add note here" 
                    style={{ width: '100%', height: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', resize: 'none', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} 
                  />
                </div>
                <button onClick={() => setActiveModalView(null)} style={{ width: '100%', height: '65px', background: '#B74C4C', color: 'white', border: 'none', fontSize: '18px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', marginTop: 'auto' }}>SAVE</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* --- 2. TABLE ASSIGNMENT MODAL --- */}
      {isTableModalOpen && (
        <>
          <div className='modal-overlay' onClick={() => setIsTableModalOpen(false)} />
          <div className='table-modal-panel'>
            <div className='table-modal-header'>
              <button className='modal-close-btn' onClick={() => setIsTableModalOpen(false)}><TbX size={24} /></button>
              <h3 className='modal-title'>ASSIGN TABLE NUMBER</h3>
              <button 
                className='modal-save-btn' 
                onClick={() => { 
                  setIsTableModalOpen(false); 
                  navigate('/checkout', { state: { cartItems, totals, orderType, orderNote } }); 
                }}
              >
                SAVE
              </button>
            </div>
            <div className='table-modal-body'>
              <span className='modal-subtitle'>Walk In</span>
              <input 
                type='number'
                className='table-number-display'
                placeholder='XX'
                value={tableNumber}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.length <= 2) {
                    setTableNumber(val);
                  }
                }}
              />
              <span className='modal-time-display'>
                {new Date().toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
              </span>
            </div>
          </div>
        </>
      )}

      {/* --- 3. DISCOUNT MODAL --- */}
      {isDiscountModalOpen && (
        <>
          <div className='modal-overlay' onClick={() => setIsDiscountModalOpen(false)} />
          <div className='discount-modal-panel'>
            
            {/* Header */}
            <div className='discount-modal-header'>
              <button className='modal-close-btn' onClick={() => setIsDiscountModalOpen(false)}>
                <TbX size={24} />
              </button>
              <h3 className='discount-modal-title'>Full Bill Discount</h3>
              <div style={{width: '80px'}}></div>
            </div>

            {/* Body */}
            <div className='discount-modal-body'>
              
              {/* Display & Type Toggle (STATIC) */}
              <div className='discount-display-section'>
                  <span className='discount-large-value'>
                    {(isSenior || isPWD) 
                      ? '20%' 
                      : discountType === 'PERCENTAGE' 
                        ? `${discountValue}%` 
                        : `₱${discountValue}`
                    }
                  </span>
                  
                  {/* Static Buttons (Always Active Colors) */}
                  <div className='discount-type-toggle'>
                      <button 
                        className={`type-btn ${discountType === 'AMOUNT' ? 'active' : ''}`} 
                        style={{ cursor: 'default' }} 
                      >
                        PHP
                      </button>
                      <button 
                        className={`type-btn ${discountType === 'PERCENTAGE' ? 'active' : ''}`} 
                        style={{ cursor: 'default' }} 
                      >
                        %
                      </button>
                  </div>
              </div>

              {/* Presets Grid (Updated for Toggle/Active State) */}
              <div className='discount-preset-grid'>
                  {[10, 20, 50, 100].map(val => (
                     <button 
                      key={val} 
                      className={`preset-btn ${discountValue === val && !isSenior && !isPWD ? 'active' : ''}`}
                      onClick={() => handlePresetClick(val)}
                     >
                       {val}%
                     </button>
                  ))}
              </div>

              {/* Senior Citizen Toggle */}
              <div className='discount-toggle-row'>
                  <span className={`toggle-label ${isSenior ? 'active' : ''}`}>Senior Citizen</span>
                  <label className="ios-switch">
                      <input 
                        type="checkbox" 
                        checked={isSenior} 
                        onChange={handleSeniorToggle}
                      />
                      <span className="slider"></span>
                  </label>
              </div>

              {/* PWD Toggle */}
              <div className='discount-toggle-row'>
                  <span className={`toggle-label ${isPWD ? 'active' : ''}`}>PWD</span>
                  <label className="ios-switch">
                      <input 
                        type="checkbox" 
                        checked={isPWD} 
                        onChange={handlePWDToggle}
                      />
                      <span className="slider"></span>
                  </label>
              </div>

              {/* Order Note */}
              <div className='discount-note-section'>
                  <label className='note-label'>Order Note</label>
                  <input 
                    type='text' 
                    className='note-input' 
                    placeholder='Add Note' 
                    value={orderNote}
                    onChange={(e) => {
                      const newVal = e.target.value;

                      const prefix = isSenior ? "Senior Citizen Discount " : (isPWD ? "PWD Discount " : "");

                      if ( prefix && !newVal.startsWith(prefix)) {
                        return;
                      }

                      setOrderNote(e.target.value);
                    }}
                  />
              </div>

              {/* Confirm Button */}
              <button 
                className='discount-confirm-btn' 
                onClick={() => setIsDiscountModalOpen(false)}
              >
                CONFIRM
              </button>
            </div>
          </div>
        </>
      )}

      {/* --- Item Qty Modal --- */}
      {isQuantityModalOpen && (
        <>
          <div 
            className='modal-overlay' 
            onClick={() => setIsQuantityModalOpen(false)}
          />
          <div className='qty-modal-panel'>
            
            {/* Header */}
            <div className='qty-modal-header'>
              <div 
                className='modal-close-btn'
                onClick={() => setIsQuantityModalOpen(false)}
              >
                  <TbX size={24}/>
              </div>
              <h3 className='qty-modal-title'>ADJUST ITEM QUANTITY</h3>
              <div style={{ width: '80px'}}></div> {/* Ghost element for centering */}
            </div>

            {/* Body */}
            <div className='qty-modal-body'>
              
              {/* 1. Name Floating on Top */}
              <h3 className='qty-floating-name'>
                {selectedItem?.item_name || 'ITEM NAME'}
              </h3>

              {/* 2. Action Row: Minus - Number - Plus */}
              <div className='qty-controls-row'>
                
                {/* Minus Button */}
                <button 
                  className='qty-circle-btn'
                  onClick={() => {
                     // Prevent going below 1
                     if (selectedItem && selectedItem.quantity > 1) {
                        onUpdateQuantity(selectedItem.id, selectedItem.quantity - 1);
                        // Update local selectedItem so number changes instantly
                        setSelectedItem(prev => ({...prev, quantity: prev.quantity - 1}));
                     }
                  }}
                >
                  <TbMinus size={32} />
                </button>

                {/* The Number */}
                <span className='qty-display-number'>
                  {selectedItem?.quantity}
                </span>

                {/* Plus Button */}
                <button 
                  className='qty-circle-btn'
                  onClick={() => {
                    if (selectedItem) {
                       onUpdateQuantity(selectedItem.id, selectedItem.quantity + 1);
                       // Update local selectedItem so number changes instantly
                       setSelectedItem(prev => ({...prev, quantity: prev.quantity + 1}));
                    }
                  }}
                >
                  <TbPlus size={32} />
                </button>
                
              </div>
            </div>

            {/* Footer */}
            <div className='qty-modal-footer'>
              <button 
                className='qty-footer-btn secondary'
                onClick={() => {
                  if (selectedItem) {
                    onRemoveItem(selectedItem.id);
                    setIsQuantityModalOpen(false);
                  }
                }}
              >
                REMOVE ITEM
              </button>
              <button 
                className='qty-footer-btn primary'
                onClick={() => setIsQuantityModalOpen(false)}
              >
                  SAVE
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}