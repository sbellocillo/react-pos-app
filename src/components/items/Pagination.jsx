const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
  startIndex,
  endIndex,
}) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const buttons = [];

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => onPageChange(currentPage - 1)}
          className="page-btn"
        >
          &lsaquo;
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => onPageChange(currentPage + 1)}
          className="page-btn"
        >
          &rsaquo;
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-inner">
        <span className="records-text">
          Showing {startIndex + 1}-{endIndex} of {totalRecords} items
        </span>
        <div className="pagination-buttons">{renderPageNumbers()}</div>
      </div>
    </div>
  );
};

export default Pagination;