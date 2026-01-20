import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import { CiCircleRemove } from "react-icons/ci";
import './styles/layouts.css';

const LayoutAssignment = () => {
    // --- State ---
    const [locations, setLocations] = useState([]);
    const [allLayouts, setAllLayouts] = useState([]); // Available menus
    const [assignments, setAssignments] = useState([]); // Currently assigned menus

    const [selectedLocationId, setSelectedLocationId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Search states
    const [locSearch, setLocSearch] = useState('');
    const [layoutSearch, setLayoutSearch] = useState('');

    // Derived
    const selectedLocation = locations.find(l => l.id === selectedLocationId);

    // --- Initial Data Load ---
    useEffect(() => {
        const initData = async () => {
            try {
                const [layoutsRes, locsRes] = await Promise.all([
                    apiEndpoints.layouts.getAll(),
                    apiEndpoints.locations.getAll()
                ]);
                if (layoutsRes.data?.success) setAllLayouts(layoutsRes.data.data);
                if (locsRes.data?.success) setLocations(locsRes.data.data);
            } catch (err) {
                console.error("Init Error:", err);
            }
        };
        initData();
    }, []);

    // --- Actions ---
    const fetchAssignments = async (locId) => {
        setAssignments([]);
        try {
            const res = await apiEndpoints.layoutPosTerminal.getLayoutsByLocation(locId);
            if (res.data?.success) setAssignments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLocationSelect = (locId) => {
        setSelectedLocationId(locId);
        fetchAssignments(locId);
    };

    const handleAssign = async (layoutId) => {
        if (!selectedLocationId) return;
        try {
            await apiEndpoints.layoutPosTerminal.assign({
                location_id: selectedLocationId,
                layout_id: layoutId
            });
            setIsModalOpen(false);
            fetchAssignments(selectedLocationId);
        } catch (err) {
            alert(err.response?.data?.message || "Assignment failed");
        }
    };

    const handleUnassign = async (layoutId) => {
        if (!window.confirm("Remove this layout from this location?")) return;
        try {
            await apiEndpoints.layoutPosTerminal.unassign({
                location_id: selectedLocationId,
                layout_id: layoutId
            });
            fetchAssignments(selectedLocationId);
        } catch (err) {
            alert("Failed to remove layout");
        }
    };

    return (
        <div className='assign-app-container'>
            <div className='assign-body-wrapper'>
                
                {/* LEFT: LOCATIONS LIST */}
                <div className='location-list-panel'>
                    <h3 className='section-title'>Store Branches</h3>
                    <input 
                        className='form-input' 
                        placeholder='Search branches...' 
                        value={locSearch}
                        onChange={e => setLocSearch(e.target.value)}
                    />
                    <div className='scrollable-list'>
                        {locations
                            .filter(l => l.name.toLowerCase().includes(locSearch.toLowerCase()))
                            .map(loc => (
                                <div
                                    key={loc.id}
                                    className={`list-item-row ${selectedLocationId === loc.id ? 'active' : ''}`}
                                    onClick={() => handleLocationSelect(loc.id)}
                                >
                                    {loc.name}
                                </div>
                            ))}
                    </div>
                </div>

                {/* RIGHT: ASSIGNMENTS */}
                <div className='layout-list-panel'>
                    {!selectedLocation ? (
                        <div className='panel-empty-state'>Select a location to manage menus</div>
                    ) : (
                        <>
                            <div className='panel-header-row'>
                                <div>
                                    <h3 className='section-title'>{selectedLocation.name}</h3>
                                    <span className='panel-subtitle'>Assigned Menus</span>
                                </div>
                                <button className='btn-primary' onClick={() => setIsModalOpen(true)}>
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
                                                    handleUnassign(a.id);
                                                }}
                                            >
                                                <CiCircleRemove size={28} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className='modal-overlay'>
                    <div className='modal-panel'>
                        <div className='modal-header'>
                            <h4>Assign Layout to {selectedLocation?.name}</h4>
                            <button className='btn-icon-action' onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <div className='modal-body'>
                            <input 
                                className='form-input' 
                                placeholder='Search layouts...'
                                value={layoutSearch}
                                onChange={e => setLayoutSearch(e.target.value)} 
                            />
                            <div className='scrollable-list'>
                                {allLayouts
                                    .filter(l => l.name.toLowerCase().includes(layoutSearch.toLowerCase()))
                                    .map(layout => {
                                        const isAssigned = assignments.some(a => a.id === layout.id);
                                        return (
                                            <button
                                                key={layout.id}
                                                className={`list-item-row ${isAssigned ? 'disabled' : ''}`}
                                                disabled={isAssigned}
                                                onClick={() => handleAssign(layout.id)}
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
            )}
        </div>
    );
};

export default LayoutAssignment;