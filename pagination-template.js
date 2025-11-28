// Universal pagination template for all table files

// 1. Add these state variables at the top of component:
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(30);

// 2. Add this pagination logic after your delete/update functions:
// Pagination calculations
const totalPages = Math.ceil(dataArray.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = dataArray.slice(startIndex, endIndex);

const handlePageChange = (page) => {
  setCurrentPage(page);
};

const renderPagination = () => {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Previous button
  if (currentPage > 1) {
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        style={{
          padding: '0.5rem 0.75rem',
          margin: '0 0.25rem',
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          color: '#374151'
        }}
      >
        ‹
      </button>
    );
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        style={{
          padding: '0.5rem 0.75rem',
          margin: '0 0.25rem',
          background: currentPage === i ? '#3b82f6' : 'white',
          color: currentPage === i ? 'white' : '#374151',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: currentPage === i ? '600' : '400'
        }}
      >
        {i}
      </button>
    );
  }

  // Next button
  if (currentPage < totalPages) {
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        style={{
          padding: '0.5rem 0.75rem',
          margin: '0 0.25rem',
          background: 'white',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          color: '#374151'
        }}
      >
        ›
      </button>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      background: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Showing {startIndex + 1}-{Math.min(endIndex, dataArray.length)} of {dataArray.length} items
        </span>
        <div style={{ display: 'flex' }}>
          {pages}
        </div>
      </div>
    </div>
  );
};

// 3. Replace dataArray.map with currentItems.map in your table
// 4. Add {renderPagination()} after </table>