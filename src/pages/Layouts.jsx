import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiEndpoints } from '../services/api';
import { MdNavigateNext } from "react-icons/md";
import './styles/layouts.css';

const Layouts = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  
  // --- State ---
  const [layouts, setLayouts] = useState([]);
  const [gridItems, setGridItems] = useState([]); // Items in the 5x5 grid
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  
  // Data for Modals
  const [allInventoryItems, setAllInventoryItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Modals
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Selection
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Search & Inputs
  const [layoutSearch, setLayoutSearch] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newItemTypeId, setNewItemTypeId] = useState('');

  // Derived
  const activeLayout = layouts.find(l => l.id === activeLayoutId);

  // --- Initial Data ---
  useEffect(() => {
    const init = async () => {
      try {
        const [layoutRes, itemRes, typeRes] = await Promise.all([
          apiEndpoints.layouts.getAll(),
          apiEndpoints.items.getAll(),
          apiEndpoints.itemTypes.getAll()
        ]);
        
        if (layoutRes.data?.success) {
          setLayouts(layoutRes.data.data);
          // Auto-select first if available
          if (layoutRes.data.data.length > 0) {
            handleLayoutSelect(layoutRes.data.data[0]);
          }
        }
        if (itemRes.data?.success) setAllInventoryItems(itemRes.data.data);
        if (typeRes.data?.success) setItemTypes(typeRes.data.data);
      } catch (err) {
        console.error("Init Error", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // --- Logic: Layout Selection ---
  const handleLayoutSelect = async (layout) => {
    if (hasUnsavedChanges) {
      if (!window.confirm("Discard unsaved changes?")) return;
    }
    setActiveLayoutId(layout.id);
    setHasUnsavedChanges(false);
    
    // Fetch Grid Items
    try {
      const res = await apiEndpoints.layoutTemplates.getAll(layout.id);
      setGridItems(res.data?.success ? res.data.data : []);
    } catch (err) {
      setGridItems([]);
    }
  };

  const handleDeleteLayout = async (layoutId) => {
    try {
      await apiEndpoints.layouts.remove(layoutId); // Soft delete
      // Remove from local list
      setLayouts(prev => prev.filter(l => l.id !== layoutId));
      if (activeLayoutId === layoutId) {
        setActiveLayoutId(null);
        setGridItems([]);
      }
    } catch (err) {
      alert("Failed to remove layout");
    }
  };

  // --- Logic: Grid Management ---
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setItemSearch('');
    setIsItemModalOpen(true);
  };

  const assignItemToSlot = (item) => {
    // Check duplicates
    if (gridItems.some(g => g.item_id === item.id)) {
      alert("Item already exists in this layout");
      return;
    }

    const newItem = {
      layout_indices_id: selectedSlot.layout_indices_id,
      item_id: item.id,
      item_name: item.name
    };

    // Replace or Add
    setGridItems(prev => [
      ...prev.filter(g => g.layout_indices_id !== selectedSlot.layout_indices_id),
      newItem
    ]);
    
    setHasUnsavedChanges(true);
    setIsItemModalOpen(false);
  };

  const removeItemFromSlot = () => {
    setGridItems(prev => prev.filter(g => g.layout_indices_id !== selectedSlot.layout_indices_id));
    setHasUnsavedChanges(true);
    setIsItemModalOpen(false);
  };

  const saveChanges = async () => {
    if (!activeLayoutId) return;
    try {
      const payload = gridItems.map(item => ({
        layout_id: activeLayoutId,
        layout_indices_id: item.layout_indices_id,
        item_id: item.item_id
      }));

      await apiEndpoints.layoutTemplates.bulkSave({
        layout_id: activeLayoutId,
        items: payload
      });
      
      setHasUnsavedChanges(false);
      alert("Saved successfully!");
    } catch (err) {
      alert("Save failed.");
    }
  };

  // --- Logic: Create Layout ---
  const handleCreate = async () => {
    if (!newLayoutName || !newItemTypeId) return alert("Missing fields");
    try {
      const res = await apiEndpoints.layouts.create({
        name: newLayoutName,
        item_type_id: parseInt(newItemTypeId),
        is_active: true
      });
      if (res.data?.success) {
        const newLayout = res.data.data;
        setLayouts(prev => [...prev, newLayout]);
        handleLayoutSelect(newLayout);
        setIsCreateModalOpen(false);
        setNewLayoutName('');
      }
    } catch (err) {
      alert("Create failed");
    }
  };

  // --- Helper: Render Grid ---
  const renderGridItems = () => {
    const slots = [];
    for (let i = 1; i <= 25; i++) {
      const item = gridItems.find(g => g.layout_indices_id === i);
      const slotData = item || { layout_indices_id: i, item_name: null };
      
      slots.push(
        <div 
          key={i}
          className={`grid-card ${item ? 'filled' : 'empty'}`}
          onClick={() => handleSlotClick(slotData)}
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
    <div className='assign-app-container'>
      <div className='assign-body-wrapper'>
        
        {/* LEFT: GRID EDITOR */}
        <div className='assign-left-col'>
          <div className='panel-header'>
            <h3 className='section-title'>{activeLayout?.name || "Select a Layout"}</h3>
            
            {hasUnsavedChanges && (
              <div style={{ display:'flex', gap:'10px'}}>
                <button className='btn-danger' onClick={() => handleLayoutSelect(activeLayout)}>Revert</button>
                <button className='btn-primary' onClick={saveChanges}>Save Changes</button>
              </div>
            )}
          </div>

          <div className='layout-grid'>
            {renderGridItems()}
          </div>
        </div>

        {/* RIGHT: LAYOUT LIST */}
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
                value={layoutSearch}
                onChange={e => setLayoutSearch(e.target.value)}
            />

            <div className='scrollable-list' style={{ marginTop: '10px' }}>
                {layouts
                    .filter(l => l.name.toLowerCase().includes(layoutSearch.toLowerCase()))
                    .map(layout => (
                        <div 
                            key={layout.id} 
                            className={`list-item-row ${activeLayoutId === layout.id ? 'active' : ''}`}
                            onClick={() => handleLayoutSelect(layout)}
                        >
                            <span>{layout.name}</span>
                            <button 
                                className='btn-icon-action'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(window.confirm("Delete layout?")) handleDeleteLayout(layout.id);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
            </div>

            <button className='btn-large-dashed' onClick={() => setIsCreateModalOpen(true)}>
                + Create New Layout
            </button>
        </div>
      </div>

      {/* MODAL: ITEM SELECTION */}
      {isItemModalOpen && (
        <div className='modal-overlay'>
          <div className='modal-panel'>
            <div className='modal-header'>
                <h4>Edit Slot #{selectedSlot?.layout_indices_id}</h4>
                <button className='btn-icon-action' onClick={() => setIsItemModalOpen(false)}>✕</button>
            </div>
            <div className='modal-body'>
                {selectedSlot?.item_name && (
                    <button className='btn-danger' onClick={removeItemFromSlot} style={{ alignSelf: 'flex-start'}}>
                        Clear Slot
                    </button>
                )}
                <input 
                    className='form-input' 
                    placeholder='Search items...' 
                    value={itemSearch} 
                    onChange={e => setItemSearch(e.target.value)}
                    autoFocus
                />
                <div className='scrollable-list'>
                    {allInventoryItems
                        .filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()))
                        .map(item => {
                             const isUsed = gridItems.some(g => g.item_id === item.id);
                             return (
                                <button 
                                    key={item.id}
                                    className={`list-item-row ${isUsed ? 'disabled' : ''}`}
                                    onClick={() => assignItemToSlot(item)}
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
      )}

      {/* MODAL: CREATE LAYOUT */}
      {isCreateModalOpen && (
        <div className='modal-overlay'>
            <div className='modal-panel' style={{ height: 'auto' }}>
                <div className='modal-header'>
                    <h4>New Layout</h4>
                    <button className='btn-icon-action' onClick={() => setIsCreateModalOpen(false)}>✕</button>
                </div>
                <div className='modal-body'>
                    <label><strong>Name</strong></label>
                    <input 
                        className='form-input' 
                        value={newLayoutName} 
                        onChange={e => setNewLayoutName(e.target.value)} 
                    />
                    
                    <label><strong>Category</strong></label>
                    <select 
                        className='form-input' 
                        value={newItemTypeId}
                        onChange={e => setNewItemTypeId(e.target.value)}
                    >
                        <option value="">Select...</option>
                        {itemTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div className='modal-footer'>
                    <button className='btn-primary' onClick={handleCreate}>Create</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Layouts;