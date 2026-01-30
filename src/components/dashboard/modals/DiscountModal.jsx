import React from 'react';
import { TbX } from "react-icons/tb";

export default function DiscountModal({
  isOpen,
  onClose,
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
  if (!isOpen) return null;

  // Logic moved here to clean up parent
  const handleSeniorToggle = (e) => {
    const checked = e.target.checked;
    setIsSenior(checked);
    if (checked) {
      setIsPWD(false);
      setDiscountValue(0);
      setDiscountType('PERCENTAGE'); 
      setOrderNote('Senior Citizen Discount');
    } else {
      setOrderNote('');
    }
  };

  const handlePWDToggle = (e) => {
    const checked = e.target.checked;
    setIsPWD(checked);
    if (checked) {
      setIsSenior(false);
      setDiscountValue(0);
      setDiscountType('PERCENTAGE');
      setOrderNote('PWD Discount');
    } else {
      setOrderNote('');
    }
  };

  const handlePresetClick = (val) => {
    if (discountValue === val && !isSenior && !isPWD) {
      setDiscountValue(0);
    } else {
      setDiscountType('PERCENTAGE');
      setDiscountValue(val);
      setIsSenior(false);
      setIsPWD(false);
    }
  };

  return (
    <>
      <div className='modal-overlay' onClick={onClose} />
          <div className='discount-modal-panel'>
            
            {/* Header */}
            <div className='discount-modal-header'>
              <button className='modal-close-btn'  onClick={onClose}>
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
  );
}