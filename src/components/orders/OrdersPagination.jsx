import React from 'react'

const OrdersPagination = ({ currentPage, totalPages, startIndex, endIndex, totalItems, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (currentPage > 1) {
        pages.push(
            <button key='prev' onClick={() => onPageChange(currentPage - 1)} className="orders-page-btn">
                ‹
            </button>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`orders-page-btn ${currentPage === i ? 'orders-page-btn-active' : ''}`}
            >
                {i}
            </button>
        );
    }


  return (
    <div className='orders-pagination-container'>
        <div className='orders-pagination-wrapper'>
            <span className='orders-page-info'>
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} orders
            </span>
            <div className='orders-page-numbers'>{pages}</div>
        </div>
    </div>
  );
};

export default OrdersPagination;