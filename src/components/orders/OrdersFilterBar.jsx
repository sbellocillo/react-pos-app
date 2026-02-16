import React from 'react'

const OrdersFilterBar = ({
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedLocation, setSelectedLocation,
    locations,
    onClear,
    totalOrders,
    totalAmount
}) => {
  // 1. Check if any filter currently has a value
  const hasFilters = Boolean(dateFrom || dateTo || selectedLocation);

  return (
    <div className='orders-filter-bar'>
        <div className='orders-filter-group'>
            <label className='orders-label'>Date From:</label>
            <input
                type='date'
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className='orders-input'
            />
        </div>

        <div className='orders-filter-group'>
            <label className='orders-label'>Date To:</label>
            <input
                type='date'
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className='orders-input'
            />
        </div>

        <div className='orders-filter-group'>
            <label className='orders-label'>Location:</label>
            <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className='orders-input orders-select-min'
            >
                <option value="">All Locations</option>
                {locations.map(location => (
                    <option key={location.id} value={location.id}>
                        {location.name}
                    </option>
                ))}
            </select>
        </div>
        
        {/* 2. Dynamically apply classes and disabled state */}
        <button 
            onClick={onClear} 
            disabled={!hasFilters}
            className={hasFilters ? "orders-btn-danger" : "orders-btn-secondary"}
            style={!hasFilters ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
            Clear Filter
        </button>

        <div className="orders-summary-box">
            <span className="orders-label">Orders Found:</span>
            <span className="orders-summary-value">{totalOrders}</span>
            <span className='orders-label' style={{ marginLeft: '1rem'}}>Total Amount:</span>
            <span className='orders-summary-total'>
                ₱{totalAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        </div>
    </div>
  );
}

export default OrdersFilterBar;