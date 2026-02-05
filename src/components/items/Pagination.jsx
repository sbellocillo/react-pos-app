import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords, startIndex, endIndex }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);


    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const buttons = [];
    
    // Previos btn
    if (currentPage > 1) {
        buttons.push(
            <button key="prev" onClick={() => onPageChange(currentPage - 1)} className='page-btn'>‹</button>
        );
    }

    // Page number
    for (let i = startPage; i <= endPage; i++) {
        buttons.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`page-btn ${currentPage === i ? 'active' : ''}`}
            >
                {i}
            </button>
        );
    }

    // Next button
    if (currentPage < totalPages) {
        buttons.push(
            <button key="next" onClick={() => onPageChange(currentPage + 1)} className="page-btn">›</button>
        );
    }

    return buttons;
  };

  return(
    <div style={{ padding: '1.5rem', background: 'white', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Showing {startIndex + 1}-{endIndex} of {totalRecords} items
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {renderPageNumbers()}
        </div>
      </div>
    </div>
  );
};

export default Pagination;