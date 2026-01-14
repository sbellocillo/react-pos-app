import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import './styles/layoutassignment.css';

const LayoutAssignment = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const locationId = currentUser.location_id || 15;
  const layoutOrderKey = `layoutOrder_${currentUser.id || "guest"}_${locationId}`;

  const [layouts, setLayouts] = useState([]);
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  
  // Local grid state
  const [gridItems, setGridItems] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [sortableLayouts, setSortableLayouts] = useState([]);
  
  const [allItems, setAllItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // --- 1. INITIAL FETCH: LAYOUTS ---
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        const response = await apiEndpoints.layouts.getByLocation(locationId);
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
  }, [locationId, layoutOrderKey]);

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
    setSearchTerm('');
    setModalOpen(true);
  };

  // --- 3. ASSIGN ITEM (Local State Update) ---
  const handleAssignItem = (item) => {
    if (!selectedSlot || !activeLayoutId) return;

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

  // --- 5. UPDATED: SAVE CHANGES VIA BULK SAVE ---
  const handleSaveChanges = async () => {
    if (!activeLayoutId) return;

    try {
        setLoading(true);

        // 1. Prepare data for bulkSave
        // The API expects { items: [ { layout_id, layout_indices_id, item_id } ] }
        const itemsPayload = gridItems.map(item => ({
            layout_id: activeLayoutId,
            layout_indices_id: item.layout_indices_id,
            item_id: item.item_id
        }));

        // 2. Clear existing templates for this layout first
        // This ensures items removed in UI are removed from DB
        await apiEndpoints.layoutTemplates.deleteByLayout(activeLayoutId);

        // 3. Bulk Save the new configuration (if there are items)
        if (itemsPayload.length > 0) {
            await apiEndpoints.layoutTemplates.bulkSave({ items: itemsPayload });
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

  const filteredItems = allItems.filter(item =>
    (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.sku && (item.sku || '').toLowerCase().includes(searchTerm.toLowerCase()))
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
                
                {unsavedChanges && (
                    <button className='save-layout-btn' onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                )}
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
          </div>

          <div className='assign-inspect-panel'>
            <h4 className="panel-header">Available Layouts</h4>
            <div className="layout-list-container">
              {sortableLayouts.map((layout) => (
                <button 
                  key={layout.id} 
                  className={`layout-list-item ${activeLayoutId === layout.id ? 'active' : ''}`}
                  onClick={() => handleLayoutClick(layout)}
                >
                  {layout.name}
                </button>
              ))}
            </div>
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoFocus
                />

                <div className='assign-item-list'>
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <button
                                key={item.id}
                                className='assign-item-row'
                                onClick={() => handleAssignItem(item)}
                            >
                                <span className='assign-item-name'>{item.name}</span>
                                <span className='assign-item-price'>
                                    {item.price ? `₱${parseFloat(item.price).toFixed(2)}` : ''}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className='assign-no-results'>No items found.</div>
                    )}
                </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LayoutAssignment;