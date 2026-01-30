import React from 'react';
import { TbX } from "react-icons/tb";

export default function OptionsModal({ 
  activeView, 
  onClose, 
  onAction, 
  noteValue, 
  setNoteValue, 
  onSaveNote 
}) {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="options-modal" style={activeView === 'note' ? { width: '445px', height: '535px' } : {}}>
        
        {activeView === 'menu' && (
          <>
            <h3 className="options-header">OPTIONS</h3>
            <ul className="options-list">
              <li><button onClick={() => onAction('newOrder')}>New Order</button></li>
              <li><button onClick={() => onAction('voidOrder')}>Void Order</button></li>
              <li><button onClick={() => onAction('splitBill')}>Split Bill</button></li>
              <li><button onClick={() => onAction('cancelOrder')}>Cancel Order</button></li>
              <li><button onClick={() => onAction('reportIssue')}>Report Issue</button></li>
              <li><button onClick={() => onAction('addOrderNote')}>Add Order Note</button></li>
            </ul>
          </>
        )}

        {activeView === 'note' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}><TbX size={24} color="#666" /></button>
                <h3 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '18px', fontWeight: '700', color: '#333' }}>Add Order Note</h3>
                <div style={{ width: '24px' }}></div>
            </div>
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea 
                value={noteValue} 
                onChange={(e) => setNoteValue(e.target.value)} 
                placeholder="Add note here" 
                style={{ width: '100%', height: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb', resize: 'none', fontSize: '16px', fontFamily: 'inherit', outline: 'none' }} 
              />
            </div>
            <button onClick={onSaveNote} style={{ width: '100%', height: '65px', background: '#B74C4C', color: 'white', border: 'none', fontSize: '18px', fontWeight: '700', cursor: 'pointer', letterSpacing: '1px', marginTop: 'auto' }}>SAVE</button>
          </div>
        )}
      </div>
    </>
  );
}