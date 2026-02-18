// src/components/assignments/LocationSidebar.jsx
import React, { useState } from 'react';
import { MdNavigateBefore } from "react-icons/md";
import { useNavigate } from 'react-router-dom'; // Ensure navigate is imported

const LocationSidebar = ({ locations, selectedLocationId, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Define the navigate function

    const filteredLocations = locations.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='location-list-panel'>
            {/* --- New Header Row Wrapper --- */}
            <div className='sidebar-header'>
                <button 
                    className='btn-icon-action left-align' 
                    onClick={() => navigate('/layouts')}
                >
                    <MdNavigateBefore size={24}/>
                </button>
                <h3 className='section-title'>Store Branches</h3>
            </div>
            {/* ------------------------------- */}

            <input 
                className='layout-form-input' 
                placeholder='Search branches...' 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            
            <div className='scrollable-list'>
                {filteredLocations.map(loc => (
                    <div
                        key={loc.id}
                        className={`list-item-row ${selectedLocationId === loc.id ? 'active' : ''}`}
                        onClick={() => onSelect(loc.id)}
                    >
                        {loc.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LocationSidebar;