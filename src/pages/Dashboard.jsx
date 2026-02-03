import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import { useCheckout } from '../hooks/useCheckout';
import OrderBillPanel from '../components/dashboard/OrderBillPanel';
import SortableCategoryButton from '../components/dashboard/SortableCategoryButton';
import { MenuSync } from '../services/MenuSync';

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const locationId = currentUser.location_id; //change to fixed int for testing
  const layoutOrderKey = `layoutOrder_${currentUser.id || "guest"}_${locationId}`;

  const { 
        cartItems, 
        orderType, 
        setOrderType, 
        isProcessing, 
        addToCart, 
        removeItem, 
        updateQuantity, 
        calculateTotals, 
        processCheckout, 
        clearCart, 
        discountType, setDiscountType,
        discountValue, setDiscountValue,
        isSenior, setIsSenior,
        isPWD, setIsPWD,
        orderNote, setOrderNote,
    } = useCheckout();

  const [layouts, setLayouts] = useState([]);
  const [activeLayoutId, setActiveLayoutId] = useState(null);
  const [gridItems, setGridItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortableLayouts, setSortableLayouts] = useState([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSortableLayouts((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);
      const newArr = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(layoutOrderKey, JSON.stringify(newArr.map((l) => l.id)));
      return newArr;
    });
  };

  // 1. Fetch Layouts (Smart Logic)
 useEffect (() => {
    const fetchLayouts = async () => {
      setLoading(true); // Start Loading
      try {
        // --- ONLINE ATTEMPT ---
        const response = await apiEndpoints.layouts.getByLocation(locationId);
        
        if (response.data && response.data.success) {
          const fetchedLayouts = response.data.data;
          
          setLayouts(fetchedLayouts);
          setSortableLayouts(fetchedLayouts);
          
          // Trigger click on first item if exists
          if (fetchedLayouts.length > 0) {
              handleLayoutClick(fetchedLayouts[0]);
          }

          // Background Sync (Don't await)
          MenuSync.syncMenu(locationId); 
        }
      } catch (error) {
        console.warn("⚠️ Offline: Switching to Local Database");
        
        // --- OFFLINE FALLBACK ---
        // 1. Load Categories
        const offlineLayouts = await MenuSync.getLayouts();
        
        if (offlineLayouts.length > 0) {
            setLayouts(offlineLayouts);
            setSortableLayouts(offlineLayouts);

            // 2. Load Items for the FIRST category immediately
            const firstLayout = offlineLayouts[0];
            setActiveLayoutId(firstLayout.id);
            
            // Manually fetch items for the first category
            const offlineItems = await MenuSync.getItems(firstLayout.id);
            setGridItems(offlineItems);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchLayouts();
  }, []);

  // 2. Handle Click (Smart Logic)
  const handleLayoutClick = async (layout) => {
    setActiveLayoutId(layout.id);
    try {
      // 1. TRY SERVER
      const response = await apiEndpoints.layoutPosTerminal.getByLayoutAndLocation(layout.id, locationId);
      if (response.data && response.data.success) {
        setGridItems(response.data.data);
      } else {
        setGridItems([]);
      }
    } catch (error) {
      console.warn(`⚠️ Offline: Loading items for layout ${layout.name}`);
      
      // 2. FAILOVER: Load from DB
      const offlineItems = await MenuSync.getItems(layout.id);
      setGridItems(offlineItems);
    }
  };

  return (
    <div className='app-container'>
        <div className='dashboard-container'>
            <div className='menu-section'>
              <h3 className='section-title'>CATEGORIES</h3>
              <div className='itm-cat-container'>
                {loading ? <p style={{padding: '1rem'}}>Loading menu...</p> : layouts.length === 0 ? <div style={{ padding: '1rem', color: 'red'}}>No Layouts Found.</div> : (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={sortableLayouts.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                      {sortableLayouts.map((layout) => (
                        <SortableCategoryButton key={layout.id} className={`itm-cat-btn ${activeLayoutId === layout.id ? 'active' : ''}`} layout={layout} activeLayoutId={activeLayoutId} handleLayoutClick={handleLayoutClick} />
                      ))}
                    </SortableContext>
                  </DndContext>
                )}
              </div>
              
            {/*Menu Grid*/}
              <div>
                  <h3 className='section-title'>MENU</h3>
                  <div className='menu-itm-grid'>
                  {(() => {
                      const fullGrid = Array(25).fill(null);
                      gridItems.forEach(item => { if (item.layout_indices_id >= 1 && item.layout_indices_id <= 25) fullGrid[item.layout_indices_id - 1] = item; });
                      return fullGrid.map((pos, index) => {
                        if (pos && pos.item_id) {
                          return <button key={pos.id || `item-${index}`} className='menu-itm-card' onClick={() => addToCart(pos)}><span className='card-label'>{(pos.item_name || "Unknown Item").toUpperCase()}</span></button>;
                        } else {
                          return <div key={`empty-${index}`} className='menu-itm-card-empty'></div>;
                        }
                      });
                  })()}
                  </div>
              </div>
            </div>
            <OrderBillPanel 
               cartItems={cartItems} 
               onRemoveItem={removeItem} 
               onUpdateQuantity={updateQuantity} 
               orderType={orderType} 
               setOrderType={setOrderType} 
               onCheckout={processCheckout} 
               totals={calculateTotals()} 
               onClearCart={clearCart}
            
               discountType={discountType}
               setDiscountType={setDiscountType}
               discountValue={discountValue}
               setDiscountValue={setDiscountValue}
            
               isSenior={isSenior}
               setIsSenior={setIsSenior}
            
               isPWD={isPWD}          
               setIsPWD={setIsPWD}    
            
               orderNote={orderNote}   
               setOrderNote={setOrderNote}
               orderNumber={null}
            />
        </div>
    </div>
  );
}