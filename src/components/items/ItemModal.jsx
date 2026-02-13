import { useState, useEffect } from "react";

const ItemModal = ({ isOpen, onClose, onSubmit, editingItem, itemTypes }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category_id: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (editingItem) {
        setFormData({
          name: editingItem.name || "",
          description: editingItem.description || "",
          price: editingItem.price || "",
          sku: editingItem.sku || "",
          category_id: editingItem.category_id || "",
          image: editingItem.image || "",
          isActive:
            editingItem.isActive !== undefined ? editingItem.isActive : true,
        });
      } else {
        setFormData({
          name: "",
          description: "",
          price: "",
          sku: "",
          category_id: "",
          image: "",
          isActive: true,
        });
      }
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    onSubmit(formData);
  };

  return (
    <div className="global-modal-overlay">
      <div className="global-modal-content">
        <div className="global-modal-header">
          <h2>{editingItem ? "Edit Item" : "Create New Item"}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Row 1 */}
            <div className="form-row">
              <div className="global-form-group half">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div className="global-form-group half">
                <label>Price *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Description */}
            <div className="global-form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Enter description"
              />
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="global-form-group half">
                <label>SKU</label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Enter SKU"
                />
              </div>
              <div className="global-form-group half">
                <label>Category *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: e.target.value })
                  }
                >
                  <option value="">Select Category...</option>
                  {itemTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Switch */}
            <div className="global-form-group checkbox-group">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
              <label htmlFor="isActive">Active Item</label>
            </div>
          </div>

          <div className="global-modal-footer">
            <button type="button" className="global-btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="global-btn-submit">
              {editingItem ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;