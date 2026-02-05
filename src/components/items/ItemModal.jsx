import React, {useState, useEffect} from 'react';

const ItemModal = ({ isOpen, onClose, onSubmit, editingItem, itemTypes }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        category_id: '',
        image: '',
        isActive: true
        
    });

    useEffect(() => {
      if(isOpen) {
        if(editingItem) {
          setFormData({
            name: editingItem.name || '',
            description: editingItem.description || '',
            price: editingItem.price || '',
            sku: editingItem.sku || '',
            category_id: editingItem.category_id || '',
            image: editingItem.image || '',
            isActive: editingItem.isActive !== undefined ? editingItem.isActive : true
          });
        } else {
          setFormData({
            name: '',
            description: '',
            price: '',
            sku: '',
            category_id: '',
            image: '',
            isActive: true
          });
        }
      }
    }, [isOpen, editingItem]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Grid Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price *</label>
              <input className="form-input" type="number" required step="0.01"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})} 
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows="3"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          {/* Grid Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
                <label className="form-label">SKU</label>
                <input className="form-input"
                    value={formData.sku}
                    onChange={e => setFormData({...formData, sku: e.target.value})} 
                />
            </div>
            <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-input" required
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})} 
                >
                    <option value="">Select Category...</option>
                    {itemTypes.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>
          </div>

          {/* Active Toggle */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" 
                    checked={formData.isActive}
                    onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                />
                <span>Active Item</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{ padding: '0.75rem', background: '#ccc', border: 'none', borderRadius:'6px' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ justifyContent: 'center'}}>
                {editingItem ? 'Update Item' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;