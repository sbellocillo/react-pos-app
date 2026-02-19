import { useEffect, useState } from "react";
// Adjust this import path based on your actual project structure
import { apiEndpoints } from "../services/api"; 

// Components
import ItemModal from "../components/items/ItemModal";
import ItemsHeader from "../components/items/ItemsHeader";
import ItemsList from "../components/items/ItemsList";
import Pagination from "../components/Pagination";
import "../styles/items.css"; 

const Items = () => {
  const [items, setItems] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

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

  const handleLimitChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); 
  };

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

  // Derived state for filtering items
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory 
      ? item.category_id?.toString() === selectedCategory.toString() 
      : true;

    return matchesSearch && matchesCategory;
  });

  // Pagination Logic uses filteredItems
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  // --- NEW: Check if any filters are currently active ---
  const hasFilters = Boolean(searchQuery || selectedCategory);

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

      <div className="controls-bar">
        {/* Left side: Search & Filter */}
        <div className="controls-left">
          <input 
            type="text" 
            placeholder="Search items or SKU..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="items-search-input"
          />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="items-category-select"
          >
            <option value="">All Categories</option>
            {itemTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* UPDATED: Dynamic Clear Filter Button */}
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory(""); }}
            disabled={!hasFilters}
            className={hasFilters ? "global-btn global-btn-danger" : "global-btn global-btn-disabled"}
            style={!hasFilters ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            Clear Filter
          </button>
        </div>

        {/* Right side: Rows per page */}
        <div className="controls-right">
          <label htmlFor="rows-select" className="rows-label">Rows per page:</label>
          <select 
            id="rows-select"
            value={itemsPerPage} 
            onChange={handleLimitChange}
            className="rows-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
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
        totalRecords={filteredItems.length}
        startIndex={startIndex}
        endIndex={Math.min(startIndex + itemsPerPage, filteredItems.length)}
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