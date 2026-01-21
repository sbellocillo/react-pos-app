import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import LayoutGrid from '../components/menuLayout/LayoutGrid';
import LayoutSidebar from '../components/menuLayout/LayoutSidebar';
import EditSlotModal from '../components/menuLayout/modals/EditSlotModal';
import CreateLayoutModal from '../components/menuLayout/modals/CreateFileModal';
import './styles/layouts.css';

const Layouts = () => {
  // --- Global State ---
  const [layouts, setLayouts] = useState([]);
  const [gridItems, setGridItems] = useState([]); 
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  
  // --- Reference Data ---
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

  // --- UI Flags ---
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // --- Selection State ---
  const [selectedSlot, setSelectedSlot] = useState(null);

  const activeLayout = layouts.find(l => l.id === activeLayoutId);

  // --- Initialization ---
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
          if (layoutRes.data.data.length > 0) {
            handleLayoutSelect(layoutRes.data.data[0]);
          }
        }
        if (itemRes.data?.success) setAllMenuItems(itemRes.data.data);
        if (typeRes.data?.success) setItemTypes(typeRes.data.data);
      } catch (err) {
        console.error("Init Error", err);
      }
    };
    init();
  }, []);

  // --- Layout Logic ---
  const handleLayoutSelect = async (layout) => {
    if (hasUnsavedChanges && !window.confirm("Discard unsaved changes?")) return;
    
    setActiveLayoutId(layout.id);
    setHasUnsavedChanges(false);
    
    try {
      const res = await apiEndpoints.layoutTemplates.getAll(layout.id);
      setGridItems(res.data?.success ? res.data.data : []);
    } catch (err) {
      setGridItems([]);
    }
  };

  const handleDeleteLayout = async (layoutId) => {
    if (!window.confirm("Delete layout?")) return;
    try {
      await apiEndpoints.layouts.remove(layoutId);
      setLayouts(prev => prev.filter(l => l.id !== layoutId));
      if (activeLayoutId === layoutId) {
        setActiveLayoutId(null);
        setGridItems([]);
      }
    } catch (err) {
      alert("Failed to remove layout");
    }
  };

  const handleCreateLayout = async (layoutData) => {
    try {
      const res = await apiEndpoints.layouts.create({
        ...layoutData,
        is_active: true
      });
      if (res.data?.success) {
        const newLayout = res.data.data;
        setLayouts(prev => [...prev, newLayout]);
        handleLayoutSelect(newLayout);
        setIsCreateModalOpen(false);
      }
    } catch (err) {
      alert("Create failed");
    }
  };

  // --- Grid/Slot Logic ---
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setIsItemModalOpen(true);
  };

  const handleAssignItem = (item) => {
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

    setGridItems(prev => [
      ...prev.filter(g => g.layout_indices_id !== selectedSlot.layout_indices_id),
      newItem
    ]);
    
    setHasUnsavedChanges(true);
    setIsItemModalOpen(false);
  };

  const handleRemoveItem = () => {
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

  return (
    <div className='assign-app-container'>
      <div className='assign-body-wrapper'>
        
        {/* Left Column */}
        <LayoutGrid 
          activeLayout={activeLayout}
          gridItems={gridItems}
          hasUnsavedChanges={hasUnsavedChanges}
          onSlotClick={handleSlotClick}
          onSave={saveChanges}
          onRevert={() => handleLayoutSelect(activeLayout)}
        />

        {/* Right Column */}
        <LayoutSidebar 
          layouts={layouts}
          activeLayoutId={activeLayoutId}
          onSelect={handleLayoutSelect}
          onDelete={handleDeleteLayout}
          onCreateClick={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* Modals */}
      <EditSlotModal 
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        selectedSlot={selectedSlot}
        menuItems={allMenuItems}
        currentGridItems={gridItems}
        onAssign={handleAssignItem}
        onRemove={handleRemoveItem}
      />

      <CreateLayoutModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        itemTypes={itemTypes}
        onCreate={handleCreateLayout}
      />
    </div>
  );
};

export default Layouts;