import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import { useCheckout } from './Checkout';
import OrderBillPanel from '../components/dashboard/OrderBillPanel';
import SortableCategoryButton from '../components/dashboard/SortableCategoryButton';

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const locationId = currentUser.location_id || 15;
  const layoutOrderKey = `layoutOrder_${currentUser.id || "guest"}_${locationId}`;

  const { cartItems, orderType, setOrderType, isProcessing, addToCart, removeItem, updateQuantity, calculateTotals, processCheckout, clearCart } = useCheckout();

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

  useEffect (() => {
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
  }, []);

  const handleLayoutClick = async (layout) => {
    setActiveLayoutId(layout.id);
    try {
      const response = await apiEndpoints.layoutPosTerminal.getByLayoutAndLocation(layout.id, locationId);
      if (response.data && response.data.success) {
        setGridItems(response.data.data);
      } else {
        setGridItems([]);
      }
    } catch (error) {
      console.error("Error fetching grid items:", error);
      setGridItems([]);
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
            <OrderBillPanel cartItems={cartItems} onRemoveItem={removeItem} onUpdateQuantity={updateQuantity} orderType={orderType} setOrderType={setOrderType} onCheckout={processCheckout} totals={calculateTotals()} onClearCart={clearCart} />
        </div>
    </div>
  );
}