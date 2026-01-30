import React, { useState, useEffect } from 'react';
import { TbX, TbMinus, TbPlus } from "react-icons/tb";

export default function QuantityModal({
  isOpen,
  onClose,
  item,
  onUpdateQuantity,
  onRemoveItem
}) {
  const [localItem, setLocalItem] = useState(item);

  // Sync local state when item prop changes or modal opens
  useEffect(() => {
    setLocalItem(item);
  }, [item, isOpen]);

  if (!isOpen || !localItem) return null;

  const handleDecrease = () => {
    if (localItem.quantity > 1) {
      const newQty = localItem.quantity - 1;
      // Update local UI immediately
      setLocalItem(prev => ({...prev, quantity: newQty}));
      // Sync with parent state
      onUpdateQuantity(localItem.id, newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = localItem.quantity + 1;
    // Update local UI immediately
    setLocalItem(prev => ({...prev, quantity: newQty}));
    // Sync with parent state
    onUpdateQuantity(localItem.id, newQty);
  };

  return (
    <>
      <div 
        className='modal-overlay' 
        onClick={onClose}
      />
      <div className='qty-modal-panel'>
        
        {/* Header */}
        <div className='qty-modal-header'>
          <div 
            className='modal-close-btn'
            onClick={onClose}
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
            {localItem?.item_name || 'ITEM NAME'}
          </h3>

          {/* 2. Action Row: Minus - Number - Plus */}
          <div className='qty-controls-row'>
            
            {/* Minus Button */}
            <button 
              className='qty-circle-btn'
              onClick={handleDecrease}
            >
              <TbMinus size={28} />
            </button>

            {/* The Number */}
            <span className='qty-display-number'>
              {localItem?.quantity}
            </span>

            {/* Plus Button */}
            <button 
              className='qty-circle-btn'
              onClick={handleIncrease}
            >
              <TbPlus size={28} />
            </button>
            
          </div>
        </div>

        {/* Footer */}
        <div className='qty-modal-footer'>
          <button 
            className='qty-footer-btn secondary'
            onClick={() => {
              if (localItem) {
                onRemoveItem(localItem.id);
                onClose();
              }
            }}
          >
            REMOVE ITEM
          </button>
          <button 
            className='qty-footer-btn primary'
            onClick={onClose}
          >
              SAVE
          </button>
        </div>
      </div>
    </>
  );
}