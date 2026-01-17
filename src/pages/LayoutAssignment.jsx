import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import './styles/layoutassignment.css';

const LayoutAssignment = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const locationId = currentUser.location_id || 15;
  const layoutOrderKey = `layoutOrder_${currentUser.id || "guest"}_GLOBAL`;

  const [layouts, setLayouts] = useState([]);
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  
  // Local grid state
  const [gridItems, setGridItems] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [sortableLayouts, setSortableLayouts] = useState([]);
  
  const [allItems, setAllItems] = useState([]);
  const [itemSearchTerm, setItemSearchTerm] = useState('');
  const [layoutSearchTerm, setLayoutSearchTerm] = useState('')

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLayoutName, setNewLayoutName] = useState('');
  const [newItemTypeId, setNewItemTypeId] = useState('');
  const [itemTypes, setItemTypes] = useState([]);

  // --- 1. INITIAL FETCH: LAYOUTS ---
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await apiEndpoints.layouts.getAll();
        if (response.data && response.data.success) {
          const fetchedLayouts = response.data.data;
          setLayouts(fetchedLayouts);
          const savedOrder = JSON.parse(localStorage.getItem(layoutOrderKey) || "[]");

          if (savedOrder.length > 0) {
            const ordered = [
              ...fetchedLayouts.filter((l) => savedOrder.includes(l.id)).sort((a, b) => savedOrder.indexOf(a.id) - savedOrder.indexOf(b.id)),
              ...fetchedLayouts.filter((l) => !savedOrder.includes(l.id)),
            ];
            setSortableLayouts(ordered);
            if (ordered.length > 0) handleLayoutClick(ordered[0]);
          } else {
            setSortableLayouts(fetchedLayouts);
            if (fetchedLayouts.length > 0) handleLayoutClick(fetchedLayouts[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching layouts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLayouts();
  }, [layoutOrderKey]);

  // --- 2. INITIAL FETCH: ALL ITEMS (For Modal) ---
  useEffect(() => {
    const fetchAllItems = async () => {
        try {
            const response = await apiEndpoints.items.getAll();
            if(response.data && response.data.success) {
                setAllItems(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching all items:", error);
        }
    };
    fetchAllItems();
  }, []);

  // --- FETCH ITEM TYPES ---
  useEffect(() => {
    const fetchItemTypes = async () => {
      try {
        const response = await apiEndpoints.itemTypes.getAll();
        if (response.data && response.data.success) {
          setItemTypes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching item types:", error);
      }
    };
    fetchItemTypes();
  }, []);

  // --- UPDATED: FETCH FROM LAYOUT TEMPLATES ---
  const fetchGridItems = async (layoutId) => {
    try {
      // Changed from layoutPosTerminal to layoutTemplates
      const response = await apiEndpoints.layoutTemplates.getAll(layoutId);
      if (response.data && response.data.success) {
        setGridItems(response.data.data);
      } else {
        setGridItems([]);
      }
      setUnsavedChanges(false); 
    } catch (error) {
      console.error("Error fetching grid items:", error);
      setGridItems([]);
    }
  };

  const handleLayoutClick = async (layout) => {
    if (unsavedChanges) {
        if (!window.confirm("You have unsaved changes. Discard them?")) return;
    }
    setActiveLayoutId(layout.id);
    await fetchGridItems(layout.id);
  };

  const handleSlotClick = (slotData) => {
    setSelectedSlot(slotData);
    setItemSearchTerm('');
    setModalOpen(true);
  };

  // --- 3. ASSIGN ITEM (Local State Update) ---
  const handleAssignItem = (item) => {
    if (!selectedSlot || !activeLayoutId) return;

    const isDuplicate = gridItems.some(gridItem => gridItem.item_id === item.id);

    if (isDuplicate) {
      alert(`The item "${item.name}" is already assigned to this layout`);
      return
    }

    const newAssignment = {
        layout_indices_id: selectedSlot.layout_indices_id,
        item_id: item.id,
        item_name: item.name,
    };

    setGridItems(prevItems => {
        const cleanedItems = prevItems.filter(
            gridItem => gridItem.layout_indices_id !== selectedSlot.layout_indices_id
        );
        return [...cleanedItems, newAssignment];
    });

    setUnsavedChanges(true); 
    setModalOpen(false);
  };

  // --- 4. REMOVE ITEM (Local State Update) ---
  const handleRemoveItem = () => {
    if (!selectedSlot) return;

    setGridItems(prevItems => {
        return prevItems.filter(
            gridItem => gridItem.layout_indices_id !== selectedSlot.layout_indices_id
        );
    });

    setUnsavedChanges(true);
    setModalOpen(false);
  };

  // --- 5. : SAVE CHANGES VIA BULK SAVE ---
  const handleSaveChanges = async () => {
    if (!activeLayoutId) return;

    try {
        setLoading(true);

        // 1. Prepare data for bulkSave
        // The API expects { layout_id, items: [ ... ] }
        const itemsPayload = gridItems.map(item => ({
            layout_id: activeLayoutId,
            layout_indices_id: item.layout_indices_id,
            item_id: item.item_id
        }));

        // 2. Call Bulk Save (Sync) ONLY
        // We pass 'layout_id' inside the body as required by your new controller logic
        if (itemsPayload.length >= 0) { // Allow saving empty payload to clear layout
            await apiEndpoints.layoutTemplates.bulkSave({ 
                layout_id: activeLayoutId,
                items: itemsPayload 
            });
        }

        alert("Layout saved successfully!");
        setUnsavedChanges(false);
        
        // Refresh from DB
        await fetchGridItems(activeLayoutId); 
    } catch (error) {
        console.error("Error saving layout:", error);
        alert("Failed to save layout.");
    } finally {
        setLoading(false);
    }
  };

  const handleRevertChanges = async () => {
    if (!activeLayoutId) return;

    // Confirmation
    const confirmRevert = window.confirm("Are you sure you want to discard unsaved changes? This will revert layout to its last saved state.");
    
    if (confirmRevert) {
      setLoading(true);
      await fetchGridItems(activeLayoutId);
      setLoading(false);
    }
  };

  // --- CREATE NEW LAYOUT HANDLER ---
  const handleCreateLayout = async () => {
    if (!newLayoutName || !newItemTypeId) {
      alert("Please enter a name and select an item type.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: newLayoutName,
        item_type_id: parseInt(newItemTypeId),
        is_active: true,
        is_default: false
      };

      const response = await apiEndpoints.layouts.create(payload);

      if (response.data && response.data.success) {
        const newLayout = response.data.data;

        setLayouts(prev => [...prev, newLayout]);
        setSortableLayouts(prev => [...prev, newLayout]);

        setActiveLayoutId(newLayout.id);
        setGridItems([]);

        setNewLayoutName('');
        setNewItemTypeId('');
        setCreateModalOpen(false);

        alert("Layout created successfully!");
      }
    } catch (error) {
        console.error("Error creating layout:", error);
        alert("Failed to create layout: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = allItems.filter(item =>
    (item.name || '').toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    (item.sku && (item.sku || '').toLowerCase().includes(itemSearchTerm.toLowerCase()))
  );

  const activeLayout = layouts.find(l => l.id === activeLayoutId);

  return (
    <>
      <div className='assign-app-container'>
        <div className="assign-body-wrapper">
          <div className='assign-left-col'>
            
            {/* HEADER WITH SAVE BUTTON */}
            <div className='assign-header-row'>
                <h3 className='section-title' style={{ marginTop: 0, marginBottom: 0 }}>
                    {activeLayout ? activeLayout.name : 'Loading Layout...'}
                </h3>
            </div>

            <div className='assign-menu-itm-grid'>
              {(() => {
                const fullGrid = Array(25).fill(null);
                gridItems.forEach(item => {
                  if (item.layout_indices_id >= 1 && item.layout_indices_id <= 25) {
                    fullGrid[item.layout_indices_id - 1] = item;
                  }
                });
                
                return fullGrid.map((pos, index) => {
                  const slotData = pos || { layout_indices_id: index + 1, item_name: null };

                  if (pos && pos.item_id) {
                    return (
                      <button 
                        key={pos.id || `item-${index}`} 
                        className='assign-menu-itm-card' 
                        onClick={() => handleSlotClick(slotData)} 
                      >
                        <span className='card-label'>
                          {(pos.item_name || "Unknown Item").toUpperCase()}
                        </span>
                        {!pos.id && <div className="unsaved-dot"></div>}
                      </button>
                    );
                  } else {
                    return (
                      <button 
                        key={`empty-${index}`} 
                        className='assign-menu-itm-card-empty'
                        onClick={() => handleSlotClick(slotData)} 
                      >
                        <span className='card-label'>EMPTY</span>
                      </button>
                    );
                  }
                });
              })()}
            </div>
            {/* --- ACTION BUTTONS --- */}
            {unsavedChanges && (
              <div className='assign-action-buttons'>
                <button 
                  className='save-layout-btn revert' 
                  onClick={handleRevertChanges}
                >
                    Revert Changes
                </button>

                <button 
                  className='save-layout-btn' 
                  onClick={handleSaveChanges}
                >
                    Save Changes
                </button>
              </div>
              )}
          </div>

          <div className='assign-inspect-panel'>
            <h4 className="panel-header">Available Layouts</h4>
            <div className="layout-list-container">
              <input
                type='text'
                className='assign-modal-search'
                placeholder='Search...'
                value={layoutSearchTerm}
                onChange={(e) => setLayoutSearchTerm(e.target.value)}
              />
              {sortableLayouts
                .filter(layout => layout.name.toLowerCase().includes(layoutSearchTerm.toLowerCase()))
                .map((layout) => (
                  <button 
                    key={layout.id} 
                    className={`layout-list-item ${activeLayoutId === layout.id ? 'active' : ''}`}
                    onClick={() => handleLayoutClick(layout)}
                  >
                    {layout.name}
                  </button>
              ))}
            </div>
            <button className='new-layout-btn'
                    onClick={() => setCreateModalOpen(true)}
            >
                + New Layout
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className='modal-overlay'>
          <div className='assign-modal-panel'>
            <div className='assign-modal-header'>
                <h4>{selectedSlot?.item_name ? 'Edit Item Slot' : 'Assign Item'}</h4>
                <button className='assign-modal-close' onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className='assign-modal-body'>
                <div className="modal-status-row">
                    <p className='modal-subtitle'>
                        {selectedSlot?.item_name
                        ? `Currently: ${selectedSlot.item_name}`
                        : `Assigning to Slot #${selectedSlot?.layout_indices_id}`} 
                    </p>
                    
                    {selectedSlot?.item_name && (
                        <button 
                            className="assign-remove-btn"
                            onClick={handleRemoveItem}
                        >
                            Remove Assignment
                        </button>
                    )}
                </div>

                <input
                    type='text'
                    className='assign-modal-search'
                    placeholder='Search items by name or SKU...'
                    value={itemSearchTerm}
                    onChange={(e) => setItemSearchTerm(e.target.value)}
                    autoFocus
                />

                <div className='assign-item-list'>
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => {

                          const isAssigned = gridItems.some(g => g.item_id === item.id);

                          return (
                            <button
                                key={item.id}
                                className={`assign-item-row ${isAssigned ? 'disabled' : ''}`}
                                onClick={() => handleAssignItem(item)}
                                disabled={isAssigned}
                            >
                                <span className='assign-item-name'>{item.name} {isAssigned ? '(Assigned)' : ''}</span>
                                <span className='assign-item-price'>
                                    {item.price ? `₱${parseFloat(item.price).toFixed(2)}` : ''}
                                </span>
                            </button>
                          )
                        })
                    ) : (
                        <div className='assign-no-results'>No items found.</div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {createModalOpen && (
        <div className='modal-overlay'>
          <div className='assign-modal-panel'>
            
            {/* Header */}
            <div className='assign-modal-header'>
                <h4>Create New Layout</h4>
                <button 
                  className='assign-modal-close' 
                  onClick={() => setCreateModalOpen(false)}
                >
                  ✕
                </button>
            </div>

            {/* Body */}
            <div className='create-modal-body'>
                
                {/* Input: Layout Name */}
                <div className='create-form-group'>
                    <label className='create-form-label'>Layout Name</label>
                    <input
                        type='text'
                        className='assign-modal-search' /* Reusing existing input style */
                        placeholder='Ex: Main Dining Food'
                        value={newLayoutName}
                        onChange={(e) => setNewLayoutName(e.target.value)}
                        autoFocus
                    />
                </div>

                {/* Input: Item Category */}
                <div className='create-form-group'>
                    <label className='create-form-label'>Item Type Category</label>
                    <select 
                        className='assign-modal-search' /* Reusing existing input style */
                        value={newItemTypeId}
                        onChange={(e) => setNewItemTypeId(e.target.value)}
                        style={{ cursor: 'pointer', appearance: 'auto' }}
                    >
                        <option value="">-- Select Type --</option>
                        {itemTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Footer Buttons */}
                <div className='create-action-row'>
                    <button 
                        className='btn-modal-cancel'
                        onClick={() => setCreateModalOpen(false)}
                    >
                        Cancel
                    </button>
                    <button 
                        className='btn-modal-create'
                        onClick={handleCreateLayout}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Layout'}
                    </button>
                </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LayoutAssignment;