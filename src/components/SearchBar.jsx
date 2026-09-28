import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import useProductStore from '../store/productStore';
import useDebounce from '../hooks/useDebounce';

/**
 * SearchBar component providing 500ms debounced search for product names.
 */
export function SearchBar() {
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSearchQuery = useProductStore((state) => state.setSearchQuery);

  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedValue = useDebounce(inputValue, 500);

  // Sync debounced input with global Zustand store
  useEffect(() => {
    if (debouncedValue !== searchQuery) {
      setSearchQuery(debouncedValue);
    }
  }, [debouncedValue, setSearchQuery, searchQuery]);

  // Sync local input if global store reset
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="product-search" className="sr-only">
        Search products by name or brand
      </label>
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          id="product-search"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products by name, brand..."
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-xs"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Clear search input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
