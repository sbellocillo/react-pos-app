import React, { useState, useEffect } from 'react';

const EditSlotModal = ({ 
  isOpen, 
  onClose, 
  selectedSlot, 
  menuItems, 
  currentGridItems, 
  onAssign, 
  onRemove 
}) => {
  const [itemSearch, setItemSearch] = useState('');

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) setItemSearch('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='global-modal-overlay'>
      <div className='modal-panel'>
        <div className='global-modal-header'>
            <h4>Edit Slot #{selectedSlot?.layout_indices_id}</h4>
            <button className='btn-icon-action' onClick={onClose}>✕</button>
        </div>
        <div className='modal-body'>
            {selectedSlot?.item_name && (
                <button 
                  className='btn-danger' 
                  onClick={onRemove} 
                  style={{ alignSelf: 'flex-start'}}
                >
                    Clear Slot
                </button>
            )}
            
            <input 
                className='global-form-input' 
                placeholder='Search items...' 
                value={itemSearch} 
                onChange={e => setItemSearch(e.target.value)}
                autoFocus
            />
            
            <div className='scrollable-list'>
                {menuItems
                    .filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                    (i.category_name && i.category_name.toLowerCase().includes(itemSearch.toLowerCase())))
                    .map(item => {
                         const isUsed = currentGridItems.some(g => g.item_id === item.id);
                         return (
                            <button 
                                key={item.id}
                                className={`list-item-row ${isUsed ? 'disabled' : ''}`}
                                onClick={() => onAssign(item)}
                                disabled={isUsed}
                            >
                                <span>{item.name}</span>
                                <span>₱{item.price}</span>
                            </button>
                         )
                    })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditSlotModal;