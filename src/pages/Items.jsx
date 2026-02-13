import { useEffect, useState } from "react";
// Adjust this import path based on your actual project structure
import { apiEndpoints } from "../services/api"; 

// Components
import ItemModal from "../components/items/ItemModal";
import ItemsHeader from "../components/items/ItemsHeader";
import ItemsList from "../components/items/ItemsList";
import Pagination from "../components/items/Pagination";
import "../styles/items.css"; 

const Items = () => {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // UPDATED: Destructure the setter so we can change the limit
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, typesRes] = await Promise.all([
        apiEndpoints.items.getAll(),
        apiEndpoints.itemTypes.getAll(),
      ]);
      setItems(itemsRes.data.data || []);
      setItemTypes(typesRes.data.data || []);
    } catch (error) {
      console.error("Failed to load data", error);
      alert("Error: Failed to load data");
    }
  };

  // --- NEW: Handle Rows Per Page Change ---
  const handleLimitChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 to avoid empty views
  };

  // --- CREATE / UPDATE ---
  const handleCreateOrUpdate = async (formData) => {
    const now = new Date().toISOString();
    const typeName =
      itemTypes.find((t) => t.id == formData.category_id)?.name || "";

    try {
      if (editingItem) {
        await apiEndpoints.items.update(editingItem.id, formData);
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  ...formData,
                  category_name: typeName,
                  updated_at: now,
                }
              : item
          )
        );
        alert("Success: Item Updated!");
      } else {
        const response = await apiEndpoints.items.create(formData);
        const newItem = {
          ...formData,
          id: response.data?.id || Math.random(), 
          category_name: typeName,
          created_at: now,
          updated_at: now,
        };
        setItems((prev) => [...prev, newItem]);
        alert("Success: Item Created!");
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Error: Operation failed.");
    }
  };

  // --- BULK IMPORT ---
  const handleBulkImport = async (parsedData) => {
    let successCount = 0;
    try {
      for (const row of parsedData) {
        const res = await apiEndpoints.items.create(row);
        if (res.data) successCount++;
      }
      alert(`Import Complete: Successfully imported ${successCount} items.`);
      fetchData(); 
    } catch (e) {
      alert(`Partial Import: Imported ${successCount} items before an error occurred.`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await apiEndpoints.items.delete(id);
        setItems((prev) => prev.filter((i) => i.id !== id));
      } catch (e) {
        alert("Error: Failed to delete item.");
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="items-page-container">
      <ItemsHeader
        onAddPress={() => {
          setEditingItem(null);
          setIsModalOpen(true);
        }}
        onImport={handleBulkImport}
        itemTypes={itemTypes}
      />

      {/* NEW: Controls Bar */}
      <div className="controls-bar" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', alignItems: 'center', gap: '8px' }}>
        <label htmlFor="rows-select" style={{ fontSize: '14px', color: '#374151' }}>Rows per page:</label>
        <select 
          id="rows-select"
          value={itemsPerPage} 
          onChange={handleLimitChange}
          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #d1d5db' }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <ItemsList
        data={currentItems}
        onEdit={(item) => {
          setEditingItem(item);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalRecords={items.length}
        startIndex={startIndex}
        endIndex={Math.min(startIndex + itemsPerPage, items.length)}
      />

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