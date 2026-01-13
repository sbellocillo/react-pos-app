import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbDots, TbX, TbToolsKitchen2, TbShoppingBag, TbTruckDelivery } from "react-icons/tb";
import { FaTrash } from "react-icons/fa6";

export default function OrderBillPanel({ cartItems, onRemoveItem, onUpdateQuantity, orderType, setOrderType, totals, isProcessing, onClearCart }) {
  const navigate = useNavigate();
  const formatCurrency = (amount) => `₱ ${Number(amount).toFixed(2)}`;
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [activeModalView, setActiveModalView] = useState(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const handleOptionClick = (action) => {
    switch (action) {
      case 'newOrder':
      case 'cancelOrder':
        if (onClearCart) onClearCart();
        setOrderNote('');
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

  const saveOrderNote = () => {
    console.log("Note saved:", orderNote);
    setActiveModalView(null);
  };

  return (
    <>
      <div className='bill-panel'>
        <div className='bill-header'>
          <h2 className='bill-title'>New Order Bill</h2>
          <button onClick={() => setActiveModalView('menu')} style={{ background: 'none', border: 'none', cursor: 'pointer', paddingRight: '40px' }}>
            <TbDots size={40} color="#000" />
          </button>
        </div>

        {/* --- OPTIONS & NOTE MODAL --- */}
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
                    <textarea value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder="Add note here" style={{ width: '100%', height: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', resize: 'none', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} />
                  </div>
                  <button onClick={saveOrderNote} style={{ width: '100%', height: '65px', background: '#B74C4C', color: 'white', border: 'none', fontSize: '18px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', marginTop: 'auto' }}>SAVE</button>
                </div>
              )}
            </div>
          </>
        )}

        <div className='order-type-group'>
          {[ { id: 1, label: 'Dine In', icon: <TbToolsKitchen2 size={18} />}, { id: 2, label: 'Takeout', icon: <TbShoppingBag size={18}/>}, { id: 3, label: 'Delivery', icon: <TbTruckDelivery size={18}/>} ].map((type) => (
            <button key={type.id} className={`order-type-btn ${orderType === type.id ? 'active' : ''}`} onClick={() => setOrderType(type.id)}>
              {type.icon} {type.label}
            </button>
          ))}
        </div>

        <div className='bill-info-grid'>
          <span className='bill-info-label'>Order Number</span> <span className='bill-info-value'>#NEW</span>
          <span className='bill-info-label'>Date</span> <span className='bill-info-value'>{new Date().toLocaleDateString()}</span>
          <span className='bill-info-label'>Time</span> <span className='bill-info-value'>{new Date().toLocaleTimeString()}</span>
          <span className='bill-info-label'>Cashier Name</span> <span className='bill-info-value'>{currentUser?.username || 'Admin'}</span>
        </div>

        <h3 className='bill-items-header'>Ordered Items</h3>
        <div className='bill-items-list'>
          {cartItems.length === 0 ? <div style={{ padding: '20px', textAlign: 'center', color: '#999'}}>No items added</div> : cartItems.map((item, index) => (
              <div className='bill-item-row' key={`${item.id}-${index}`}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 2, minWidth: 0}}>
                  <div className='bill-item-qty' onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{cursor: 'pointer'}}>{item.quantity}</div>
                  <span className='bill-item-name'>{item.item_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <span className='bill-item-price'>{formatCurrency(item.price * item.quantity)}</span>
                  <FaTrash size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => onRemoveItem(item.id)} />
                </div>
              </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className='bill-summary'>
            <div className='summary-row'><span>Sub Total</span><span>{formatCurrency(totals.subtotal)}</span></div>
            <div className='summary-row'><span onClick={() => setIsDiscountModalOpen(true)} style={{cursor:'pointer'}}>Discount</span><span>₱ 0.00</span></div>
            <div className='summary-row'><span>Tax</span><span>{formatCurrency(totals.tax)}</span></div>
          </div>
          <button className='pay-button' onClick={() => setIsTableModalOpen(true)} disabled={isProcessing || cartItems.length === 0} style={{ opacity: isProcessing ? 0.7 : 1}}>
            {isProcessing ? 'PROCESSING...' : formatCurrency(totals.total)}
          </button>
        </div>
      </div>

      {/* --- TABLE MODAL --- */}
      {isTableModalOpen && (
          <>
            <div className='modal-overlay' onClick={() => setIsTableModalOpen(false)} />
            <div className='table-modal-panel'>
              <div className='table-modal-header'>
                <button className='modal-close-btn' onClick={() => setIsTableModalOpen(false)}><TbX size={24} /></button>
                <h3 className='modal-title'>ASSIGN TABLE NUMBER</h3>
                <button className='modal-save-btn' onClick={() => { setIsTableModalOpen(false); navigate('/checkout', { state: { cartItems, totals, orderType, orderNote } }); }}>SAVE</button>
              </div>
              <div className='table-modal-body'>
                <span className='modal-subtitle'>Walk In</span>
                <div className='table-number-display'>XX</div>
                <span className='modal-time-display'>HH:MM</span>
              </div>
            </div>
          </>
      )}

      {/* --- DISCOUNT MODAL --- */}
      {isDiscountModalOpen && (
          <>
            <div className='modal-overlay' onClick={() => setIsDiscountModalOpen(false)} />
            <div className='discount-modal-panel'>
              <div className='discount-modal-header'>
                <button className='modal-close-btn' onClick={() => setIsDiscountModalOpen(false)}><TbX size={24} /></button>
                <h3 className='discount-modal-title'>Full Bill Discount</h3>
                <div style={{width: '80px'}}></div>
              </div>
              <div className='discount-modal-body'>
                <div className='discount-display-section'>
                    <span className='discount-large-value'>0%</span>
                    <div className='discount-type-toggle'><button className='type-btn'>PHP</button><button className='type-btn active'>%</button></div>
                </div>
                <div className='discount-preset-grid'>
                    <button className='preset-btn'>20%</button><button className='preset-btn'>25%</button><button className='preset-btn'>50%</button><button className='preset-btn'>100%</button>
                </div>
                <div className='discount-toggle-row'><span className='toggle-label'>Senior Citizen</span><label className="ios-switch"><input type="checkbox" /><span className="slider"></span></label></div>
                <div className='discount-toggle-row'><span className='toggle-label'>PWD</span><label className="ios-switch"><input type="checkbox" /><span className="slider"></span></label></div>
                <div className='discount-note-section'>
                    <label className='note-label'>Order Note</label>
                    <input type="text" className='note-input' placeholder='Add Note' />
                </div>
                <button className='discount-confirm-btn' onClick={() => setIsDiscountModalOpen(false)}>CONFIRM</button>
              </div>
            </div>
          </>
      )}
    </>
  );
}