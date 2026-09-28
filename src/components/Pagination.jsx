import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component for client-side pagination.
 * @param {Object} props
 * @param {number} props.currentPage
 * @param {number} props.totalPages
 * @param {number} props.totalItems
 * @param {number} props.pageSize
 * @param {Function} props.onPageChange
 */
export function Pagination({ currentPage, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-slate-200"
      aria-label="Pagination Navigation"
    >
      {/* Item Counter */}
      <div className="text-sm text-slate-600">
        Showing <span className="font-semibold text-slate-900">{startItem}</span> to{' '}
        <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span> products
      </div>

      {/* Navigation Buttons */}
      <div className="inline-flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-xs"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden md:flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className="h-9 w-9 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="px-1 text-slate-400 text-sm">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`h-9 w-9 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                currentPage === page
                  ? 'bg-indigo-600 text-white font-semibold border border-indigo-600 shadow-xs'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-1 text-slate-400 text-sm">...</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className="h-9 w-9 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-xs"
          aria-label="Go to next page"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
