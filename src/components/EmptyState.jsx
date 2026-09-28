import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';
import useProductStore from '../store/productStore';

/**
 * EmptyState component displayed when search or filter returns no items.
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {Function} [props.onReset]
 */
export function EmptyState({ title, description, onReset }) {
  const resetFilters = useProductStore((state) => state.resetFilters);

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      resetFilters();
    }
  };

  return (
    <div className="w-full my-8 p-12 bg-white border border-slate-200/80 rounded-2xl flex flex-col items-center text-center shadow-xs">
      <div className="p-4 bg-slate-100 text-slate-400 rounded-full mb-4">
        <PackageSearch className="h-10 w-10" />
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-1">
        {title || 'No products found'}
      </h3>

      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
        {description || 'We could not find any products matching your current search criteria or category filter.'}
      </p>

      <button
        type="button"
        onClick={handleReset}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" />
        Clear Filters
      </button>
    </div>
  );
}

export default EmptyState;
