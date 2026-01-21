import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdNavigateNext } from "react-icons/md";

const LayoutSidebar = ({ 
  layouts, 
  activeLayoutId, 
  onSelect, 
  onDelete, 
  onCreateClick 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLayouts = layouts.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='assign-inspect-panel'>
      <div className='panel-header'>
        <h3 className='section-title'>Layouts</h3>
        <button className='btn-icon-action' onClick={() => navigate('/layoutassignment')}>
            Assign Mode <MdNavigateNext size={20}/>
        </button>
      </div>

      <input 
        className='form-input' 
        placeholder='Search layouts...'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className='scrollable-list' style={{ marginTop: '10px' }}>
        {filteredLayouts.map(layout => (
            <div 
                key={layout.id} 
                className={`list-item-row ${activeLayoutId === layout.id ? 'active' : ''}`}
                onClick={() => onSelect(layout)}
            >
                <span>{layout.name}</span>
                <button 
                    className='btn-icon-action'
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(layout.id);
                    }}
                >
                    ✕
                </button>
            </div>
        ))}
      </div>

      <button className='btn-large-dashed' onClick={onCreateClick}>
        + Create New Layout
      </button>
    </div>
  );
};

export default LayoutSidebar;