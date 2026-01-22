import { useEffect, useMemo, useState } from 'react';
import { apiEndpoints } from '../services/api';

const LayoutCategory = () => {
    const [layouts, setLayouts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingLayout, setEditingLayout] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSizeOptions = [5,10,15,20,25,30,35,40,45,50];
    const [itemsPerPage, setItemsPerPage] = useState(5);

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);


    const [formData, setFormData] = useState({
        name: '',
        is_default: false,
        is_active: true,
        item_type_id: null,
    });

    const normalizeRows = (response) => {
        const rows = response?.data?.data ?? response?.data ?? [];
        return Array.isArray(rows) ? rows : [];
    };

    const boolish = (v) => {
        if (typeof v === 'boolean') return v;
        if (typeof v === 'number') return v === 1;
        if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
        return false;
    };

    const fetchLayouts = async () => {
        try {
        setLoading(true);
        setError(null);

        const res = await apiEndpoints.layouts.getAll();
        setLayouts(normalizeRows(res));
        } catch (err) {
        console.log('RESPONSE:', err?.response?.data);
        } finally {
        setLoading(false);
        }
    };

    const createLayout = async (payload) => {
        await apiEndpoints.layouts.create(payload);
    };

    const updateLayout = async (id, payload) => {
        await apiEndpoints.layouts.update(id, payload);
    };

    const deleteLayout = async (id) => {
        await apiEndpoints.layouts.delete(id);
    };

    useEffect(() => {
        fetchLayouts();
    }, []);

    const openModal = (row = null) => {
        setEditingLayout(row);

        if (row) {
            setFormData({
            name: row.name ?? '',
            is_default: boolish(row.is_default),
            is_active: boolish(row.is_active),
            item_type_id: row.item_type_id ?? null,
            });
        } else {
            setFormData({
            name: '',
            is_default: false,
            is_active: true,
            item_type_id: null,
            });
        }

        setShowModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
        setEditingLayout(null);
    };

    // ---------- Form ----------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
        alert('Please enter a Name');
        return;
    }

    const payload = {
        name: formData.name.trim(),
        is_default: !!formData.is_default,
        is_active: !!formData.is_active,
    };

    if (formData.item_type_id) {
        payload.item_type_id = Number(formData.item_type_id);
    }

    try {
      if (editingLayout?.id) {
        await updateLayout(editingLayout.id, payload);
        alert('Layout updated successfully!');
      } else {
        await createLayout(payload);
        alert('Layout created successfully!');
      }

      closeModal();
      await fetchLayouts();
    } catch (err) {
    const status = err?.response?.status;
        const data = err?.response?.data;

        console.log('SAVE FAILED');
        console.log('STATUS:', status);
        console.log('RESPONSE:', data);
        console.log('PAYLOAD SENT:', payload);

        alert(
            `Failed to save. ${status}\n\n` +
            `Response:\n${JSON.stringify(data, null, 2)}`
        );
        }

    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this layout?')) return;

        try {
        await deleteLayout(id);
        alert('Layout deleted successfully!');
        await fetchLayouts();
        } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete. Check console / API response.');
        }
    };

    const totalPages = Math.max(1, Math.ceil(layouts.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const currentRows = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return layouts.slice(startIndex, startIndex + itemsPerPage);
    }, [layouts, currentPage, itemsPerPage]);


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const renderPagination = () => {
    if (layouts.length <= itemsPerPage) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
      pages.push(
        <button key="prev" onClick={() => setCurrentPage(currentPage - 1)} style={pagerBtnStyle}>
          ‹
        </button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          style={{
            ...pagerBtnStyle,
            background: currentPage === i ? '#dc2626' : 'white',
            color: currentPage === i ? 'white' : '#374151',
            fontWeight: currentPage === i ? '600' : '400',
          }}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button key="next" onClick={() => setCurrentPage(currentPage + 1)} style={pagerBtnStyle}>
          ›
        </button>
      );
    }

    return (
      <div style={pagerWrapStyle}>
        <span style={{ marginRight: '1rem', color: '#6b7280' }}>
          Showing {layouts.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, layouts.length)} of {layouts.length}{' '}
          layouts
        </span>
        {pages}
      </div>
    );
  };

    return (
        <div style={{ padding: '2rem', background: '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
            <h1 style={{ margin: 0, color: '#1f2937', fontSize: '2rem' }}>Layouts</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage layout records</p>
            </div>

            <button onClick={() => openModal()} style={addBtnStyle}>
            <span>+</span>
            Add New Layout
            </button>
        </div>

        <div style={{ marginBottom: '1rem' }}>Total Records: {layouts.length}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ color: '#374151', fontWeight: 500 }}>Show:</span>

            <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                background: 'white',
                color: '#374151',
                cursor: 'pointer',
                outline: 'none',
                fontWeight: 500,
                }}
            >
                {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                    {size}
                </option>
                ))}
            </select>

            <span style={{ color: '#6b7280' }}>per page</span>
        </div>


        {loading && <div style={{ padding: '1rem' }}>Loading layouts...</div>}
        {error && <div style={{ padding: '1rem', color: 'red' }}>{error}</div>}

        <div style={tableWrapStyle}>
            <div style={{ overflowX: 'auto', maxHeight: 650, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead className="th-position">
                    <tr style={{ background: '#f8fafc' }}>
                    <th className="th-text-center">ID</th>
                    <th className="th-text-left">Name</th>
                    <th className="th-text-center">Default</th>
                    <th className="th-text-center">Active</th>
                    <th style={actionThStyle}>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {!loading &&
                    currentRows.map((row, index) => (
                        <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td className="td-text-center">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>

                        <td style={{ padding: '1rem' }}>{row.name}</td>
                        <td className="td-text-center">{String(boolish(row.is_default))}</td>
                        <td className="td-text-center">{String(boolish(row.is_active))}</td>

                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button onClick={() => openModal(row)} style={editBtnStyle}>
                                Edit
                            </button>
                            <button onClick={() => handleDelete(row.id)} style={delBtnStyle}>
                                Delete
                            </button>
                            </div>
                        </td>
                        </tr>
                    ))}
                </tbody>
                </table>

                {!loading && layouts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    No layouts found. Add your first layout.
                </div>
                )}
            </div>

            {renderPagination()}
        </div>  


        {showModal && (
            <div style={modalOverlayStyle}>
                <div style={modalCardStyle}>
                    <div style={modalHeaderStyle}>
                    <h2 style={{ margin: 0, color: '#1f2937', fontSize: '1.5rem' }}>
                        {editingLayout ? 'Edit Layout' : 'Add New Layout'}
                    </h2>
                    <button onClick={closeModal} style={closeBtnStyle}>
                        ×
                    </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={labelStyle}>Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} />
                    </div>

                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <label style={checkboxLabelStyle}>
                        <input type="checkbox" name="is_default" checked={formData.is_default} onChange={handleChange} />
                        Default
                        </label>

                        <label style={checkboxLabelStyle}>
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} />
                        Active
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={closeModal} style={cancelBtnStyle}>
                        Cancel
                        </button>
                        <button type="submit" style={saveBtnStyle}>
                        {editingLayout ? 'Update' : 'Create'}
                        </button>
                    </div>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
};

// ---- styles ----
const addBtnStyle = {
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '1rem 2rem',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const tableWrapStyle = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',  
};


const actionThStyle = {
  padding: '1rem',
  textAlign: 'center',
  borderBottom: '1px solid #e5e7eb',
  color: '#374151',
  fontWeight: '600',
  width: '150px',
};

const pagerBtnStyle = {
  padding: '0.5rem 0.75rem',
  margin: '0 0.25rem',
  background: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
  color: '#374151',
};

const pagerWrapStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem',
  gap: '0.5rem',
};

const editBtnStyle = {
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const delBtnStyle = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalCardStyle = {
  background: 'white',
  borderRadius: '16px',
  padding: '2rem',
  width: '90%',
  maxWidth: '500px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#6b7280',
  padding: '0.5rem',
  borderRadius: '6px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
  color: '#374151',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '1rem',
  outline: 'none',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: '#374151',
};

const cancelBtnStyle = {
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
};

const saveBtnStyle = {
  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: '500',
  cursor: 'pointer',
};

export default LayoutCategory;
