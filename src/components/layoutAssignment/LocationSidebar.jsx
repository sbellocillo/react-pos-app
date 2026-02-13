// src/components/assignments/LocationSidebar.jsx
import React, { useState } from 'react';

const LocationSidebar = ({ locations, selectedLocationId, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLocations = locations.filter(l => 
        l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='location-list-panel'>
            <h3 className='section-title'>Store Branches</h3>
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