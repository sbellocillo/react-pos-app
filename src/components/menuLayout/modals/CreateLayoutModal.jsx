import React, { useState } from 'react';

const CreateLayoutModal = ({ isOpen, onClose, itemTypes, onCreate }) => {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');

  const handleSubmit = () => {
    if (!name || !typeId) return alert("Missing fields");
    onCreate({ name, item_type_id: parseInt(typeId) });
    // Reset form
    setName('');
    setTypeId('');
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
        <div className='modal-panel' style={{ height: 'auto' }}>
            <div className='modal-header'>
                <h4>New Layout</h4>
                <button className='btn-icon-action' onClick={onClose}>✕</button>
            </div>
            <div className='modal-body'>
                <label><strong>Name</strong></label>
                <input 
                    className='form-input' 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                />
                
                <label><strong>Category</strong></label>
                <select 
                    className='form-input' 
                    value={typeId}
                    onChange={e => setTypeId(e.target.value)}
                >
                    <option value="">Select...</option>
                    {itemTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
            </div>
            <div className='modal-footer'>
                <button className='btn-primary' onClick={handleSubmit}>Create</button>
            </div>
        </div>
    </div>
  );
};

export default CreateLayoutModal;