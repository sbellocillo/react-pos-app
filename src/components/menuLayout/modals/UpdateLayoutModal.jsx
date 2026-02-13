import React, { useState } from 'react';

const UpdateLayoutModal = ({ isOpen, onClose, itemTypes, onUpdate, activeLayoutId }) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [isDefault, setIsDefault] = useState(false); // ✅ Added state for the checkbox

  const handleSubmit = () => {
    if (!name || !typeId) return alert("Missing fields");
    
    // ✅ Added is_default and is_active to satisfy your database constraints
    onUpdate(activeLayoutId, { 
        name, 
        item_type_id: parseInt(typeId),
        is_default: isDefault,
        is_active: true 
    });
    
    // Reset form
    setName('');
    setTypeId('');
    setIsDefault(false);
  };

  if (!isOpen) return null;

  return (
    <div className='global-modal-overlay'>
        <div className='modal-panel' style={{ height: 'auto' }}>
            <div className='global-modal-header'>
                <h4>Update Layout</h4>
                <button className='btn-icon-action' onClick={onClose}>✕</button>
            </div>
            <div className='modal-body'>
                <label><strong>Name</strong></label>
                <input 
                    className='global-form-input' 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                />
                
                <label><strong>Category</strong></label>
                <select 
                    className='global-form-input' 
                    value={typeId}
                    onChange={e => setTypeId(e.target.value)}
                >
                    <option value="">Select...</option>
                    {itemTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>

                {/* ✅ Added Checkbox UI */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '15px', gap: '8px' }}>
                    <input 
                        type="checkbox" 
                        id="isDefaultCheckbox"
                        checked={isDefault}
                        onChange={e => setIsDefault(e.target.checked)}
                        style={{ width: 'auto', cursor: 'pointer' }}
                    />
                    <label htmlFor="isDefaultCheckbox" style={{ margin: 0, cursor: 'pointer' }}>
                        <strong>Set as Default Layout</strong>
                    </label>
                </div>

            </div>
            <div className='global-modal-footer'>
                <button className='global-btn-primary' onClick={handleSubmit}>Save</button>
            </div>
        </div>
    </div>
  );
};

export default UpdateLayoutModal;