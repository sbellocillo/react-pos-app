const ItemsList = ({ data, onEdit, onDelete }) => {
  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  if (!data || data.length === 0) {
    return (
      <div className="empty-container">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="global-table-wrapper">
      <table className="items-table">
        <thead>
          <tr>
            <th className="w-image">Image</th>
            <th className="w-name">Name</th>
            <th className="w-desc">Description</th>
            <th className="w-price text-right">Price</th>
            <th className="w-sku">SKU</th>
            <th className="w-type">Type</th>
            <th className="w-date">Updated</th>
            <th className="w-actions text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="image-cell">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="item-img" />
                  ) : (
                    <div className="no-image">No Img</div>
                  )}
                </div>
              </td>
              <td className="font-bold">{item.name}</td>
              <td title={item.description} className="truncate">
                {item.description}
              </td>
              <td className="text-right">{Number(item.price).toFixed(2)}</td>
              <td>{item.sku}</td>
              <td>
                <span className="badge">
                  {item.category_name || "N/A"}
                </span>
              </td>
              <td>{formatDate(item.updated_at)}</td>
              <td className="actions-cell">
                <button
                  className="btn-sm btn-edit"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn-sm btn-delete"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemsList;