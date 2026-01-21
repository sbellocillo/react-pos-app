// src/components/assignments/AssignmentPanel.jsx
import React from 'react';
import { CiCircleRemove } from "react-icons/ci";

const AssignmentPanel = ({ selectedLocation, assignments, onOpenModal, onUnassign }) => {
    
    if (!selectedLocation) {
        return (
            <div className='layout-list-panel'>
                <div className='panel-empty-state'>Select a location to manage menus</div>
            </div>
        );
    }

    return (
        <div className='layout-list-panel'>
            <div className='panel-header-row'>
                <div>
                    <h3 className='section-title'>{selectedLocation.name}</h3>
                    <span className='panel-subtitle'>Assigned Menus</span>
                </div>
                <button className='btn-primary' onClick={onOpenModal}>
                    + Assign Layout
                </button>
            </div>

            <div className='scrollable-list'>
                {assignments.length === 0 ? (
                    <div className='panel-empty-state'>No layouts assigned yet.</div>
                ) : (
                    assignments.map(a => (
                        <div key={a.id} className='list-item-row'>
                            <div>
                                <strong>{a.name}</strong>
                                <div className='panel-subtitle'>{a.item_type_name}</div>
                            </div>
                            <button 
                                className='btn-icon-action' 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUnassign(a.id);
                                }}
                            >
                                <CiCircleRemove size={28} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignmentPanel;