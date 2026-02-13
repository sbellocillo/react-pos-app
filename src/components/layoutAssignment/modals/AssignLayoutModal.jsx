// src/components/assignments/modals/AssignLayoutModal.jsx
import React, { useState, useEffect } from 'react';

const AssignLayoutModal = ({ 
    isOpen, 
    onClose, 
    locationName, 
    allLayouts, 
    currentAssignments, 
    onAssign 
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Clear search when modal opens/closes
    useEffect(() => {
        if(isOpen) setSearchTerm('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className='global-modal-overlay'>
            <div className='modal-panel'>
                <div className='global-modal-header'>
                    <h4>Assign Layout to {locationName}</h4>
                    <button className='btn-icon-action' onClick={onClose}>✕</button>
                </div>
                <div className='modal-body'>
                    <input 
                        className='global-form-input' 
                        placeholder='Search layouts...'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)} 
                        autoFocus
                    />
                    <div className='scrollable-list'>
                        {allLayouts
                            .filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(layout => {
                                // Check if this layout is already assigned to this store
                                const isAssigned = currentAssignments.some(a => a.id === layout.id);
                                return (
                                    <button
                                        key={layout.id}
                                        className={`list-item-row ${isAssigned ? 'disabled' : ''}`}
                                        disabled={isAssigned}
                                        onClick={() => onAssign(layout.id)}
                                    >
                                        <span>{layout.name}</span>
                                        {isAssigned && <small>(Assigned)</small>}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignLayoutModal;