import React from 'react';
import '../styles/Pagination.css'

function Pagination({ currentPage, totalPages, onNextPage, onPrevPage, onGoToPage }) {
  return (
    <div className="pagination-wrapper">
      <button className="pagination-btn"  onClick={onPrevPage} disabled={currentPage === 1}>
        Précédent
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          className="pagination-btn"
          key={index}
          onClick={() => onGoToPage(index + 1)}
          disabled={currentPage === index + 1}
        >
          {index + 1}
        </button>
      ))}
      <button className="pagination-btn" onClick={onNextPage} disabled={currentPage === totalPages}>
        Suivant
      </button>
    </div>
  );
}

export default Pagination;