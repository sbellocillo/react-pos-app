import React from 'react';

const LayoutGrid = ({ 
  activeLayout, 
  gridItems, 
  hasUnsavedChanges, 
  onSlotClick, 
  onSave, 
  onRevert 
}) => {

  const renderSlots = () => {
    const slots = [];
    for (let i = 1; i <= 25; i++) {
      const item = gridItems.find(g => g.layout_indices_id === i);
      const slotData = item || { layout_indices_id: i, item_name: null };
      
      slots.push(
        <div 
          key={i}
          className={`grid-card ${item ? 'filled' : 'empty'}`}
          onClick={() => onSlotClick(slotData)}
        >
          {item ? (
            <>
              <span>{item.item_name}</span>
              {!item.id && <div className="unsaved-dot" />}
            </>
          ) : (
            <span>Empty</span>
          )}
        </div>
      );
    }
    return slots;
  };

  return (
    <div className='assign-left-col'>
      <div className='panel-header'>
        <h3 className='section-title'>{activeLayout?.name || "Select a Layout"}</h3>
        
        {hasUnsavedChanges && (
          <div style={{ display:'flex', gap:'10px'}}>
            <button className='btn-danger' onClick={onRevert}>Revert</button>
            <button className='btn-primary' onClick={onSave}>Save Changes</button>
          </div>
        )}
      </div>

      <div className='layout-grid'>
        {renderSlots()}
      </div>
    </div>
  );
};

export default LayoutGrid;