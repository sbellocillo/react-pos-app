import React, { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api'; // Adjust path to your API service

// --- Import Sub-Components & Styles ---
import Pagination from '../components/items/Pagination'; // Adjust path if needed
import ItemModal from '../components/items/ItemModal';   // Adjust path if needed
import '../components/items/styles/Items.css';           // Adjust path if needed

const Items = () => {
  // --- STATE MANAGEMENT ---
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(30);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        // Fetch Items and Types in parallel
        const [itemsRes, typesRes] = await Promise.all([
            apiEndpoints.items.getAll(),
            apiEndpoints.itemTypes.getAll()
        ]);
        
        // Safety check: ensure we are setting arrays
        setItems(itemsRes.data.data || []);
        setItemTypes(typesRes.data.data || []);
    } catch (error) {
        console.error("Failed to load data", error);
    }
  };

  // --- 2. CREATE / UPDATE LOGIC ---
  const handleCreateOrUpdate = async (formData) => {
    const now = new Date().toISOString(); 
    
    // Find category name for UI update (optimistic)
    const typeName = itemTypes.find(t => t.id == formData.category_id)?.name || '';

    if (editingItem) {
        // --- UPDATE ---
        try {
            await apiEndpoints.items.update(editingItem.id, formData);
            
            // Update local state immediately
            setItems(prev => prev.map(item => 
                item.id === editingItem.id 
                ? { ...item, ...formData, category_name: typeName, updated_at: now } 
                : item
            ));
            alert("Item Updated!");
        } catch (e) { 
            console.error("Update failed", e);
            alert("Failed to update item.");
        }
    } else {
        // --- CREATE ---
        try {
            const response = await apiEndpoints.items.create(formData);
            
            // Construct new item object (using ID from server if available, else temp)
            const newItem = { 
                ...formData, 
                id: response.data?.id || Math.max(...items.map(i => i.id), 0) + 1,
                category_name: typeName, 
                created_at: now, 
                updated_at: now 
            };
            
            setItems(prev => [...prev, newItem]); 
            alert("Item Created!");
        } catch (e) { 
            console.error("Create failed", e);
            alert("Failed to create item.");
        }
    }
    setIsModalOpen(false);
  };

  // --- 3. DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
        await apiEndpoints.items.delete(id);
        setItems(prev => prev.filter(i => i.id !== id));
    } catch (e) { 
        console.error("Delete failed", e);
        alert("Failed to delete item.");
    }
  };

  // --- 4. MODAL HANDLERS ---
  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // --- 5. PAGINATION CALCULATIONS ---
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  // Calculate end index strictly for slicing
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Helper: Format Date
  const formatDate = (iso) => {
    if(!iso) return '-';
    const d = new Date(iso);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // --- RENDER ---
  return (
    <div className="items-container">
      {/* HEADER */}
      <div className="items-header">
        <div className="items-title">
          <h2>Items Management</h2>
          <p>Manage menu items, pricing, and inventory</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <span>+</span> Add New Item
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="items-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th style={{textAlign:'right'}}>Price</th>
              <th>SKU</th>
              <th>Type</th>
              <th>Updated</th>
              <th style={{textAlign:'center'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(item => (
              <tr key={item.id}>
                <td>
                    {item.image ? (
                        <img src={item.image} alt={item.name} style={{width: 50, height: 50, objectFit:'cover', borderRadius:6}} />
                    ) : (
                        <div style={{width:50, height:50, background:'#f3f4f6', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#999'}}>No Img</div>
                    )}
                </td>
                <td style={{fontWeight:500}}>{item.name}</td>
                <td style={{color:'#666', maxWidth: 200, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>
                    {item.description}
                </td>
                <td style={{textAlign:'right', fontWeight:600}}>
                    {Number(item.price).toFixed(2)}
                </td>
                <td style={{fontFamily:'monospace', color:'#666'}}>{item.sku}</td>
                <td>
                    <span style={{background:'#f3f4f6', padding:'2px 8px', borderRadius:4, fontSize:12}}>
                        {item.category_name || item.item_type_name || 'N/A'}
                    </span>
                </td>
                <td style={{fontSize:13, color:'#888'}}>
                    {formatDate(item.updated_at)}
                </td>
                <td style={{textAlign:'center'}}>
                    <div style={{display:'flex', justifyContent:'center'}}>
                        <button onClick={() => openEditModal(item)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDelete(item.id)} className="btn-delete">Delete</button>
                    </div>
                </td>
              </tr>
            ))}
            {currentItems.length === 0 && (
                <tr>
                    <td colSpan="8" style={{textAlign:'center', padding:20, color:'#999'}}>No items found.</td>
                </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION COMPONENT */}
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalRecords={items.length}
            startIndex={startIndex}
            endIndex={endIndex}
        />
      </div>

      {/* MODAL COMPONENT */}
      <ItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        editingItem={editingItem}
        itemTypes={itemTypes}
      />
    </div>
  );
};

export default Items;