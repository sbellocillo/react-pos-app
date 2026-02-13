import CSVUploader from "./CSVUploader";

const ItemsHeader = ({ onAddPress, onImport, itemTypes }) => {
  return (
    <div className="page-header">
      <div className="title-section">
        <h1 className="title">Items Management</h1>
        <p className="subtitle">Manage menu items, pricing, and inventory</p>
      </div>

      <div className="actions-section">
        <CSVUploader onImport={onImport} itemTypes={itemTypes} />
        
        <button className="global-btn-primary" onClick={onAddPress}>
          + Add New
        </button>
      </div>
    </div>
  );
};

export default ItemsHeader;