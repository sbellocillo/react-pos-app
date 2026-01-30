import React from 'react';
import { TbX } from "react-icons/tb";

export default function TableModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  tableNumber, 
  setTableNumber 
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className='modal-overlay' onClick={onClose} />
      <div className='table-modal-panel'>
        <div className='table-modal-header'>
          <button className='modal-close-btn' onClick={onClose}><TbX size={24} /></button>
          <h3 className='modal-title'>ASSIGN TABLE</h3>
          <button className='modal-save-btn' onClick={onConfirm}>
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
              if (val.length <= 2) setTableNumber(val);
            }}
          />
          <span className='modal-time-display'>
            {new Date().toLocaleTimeString([], { 
                hour: '2-digit', minute: '2-digit', hour12: false 
              })}
          </span>
        </div>
      </div>
    </>
  );
}