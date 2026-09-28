import React, { useMemo } from 'react';
import { Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import useProductStore from '../store/productStore';
import { capitalize } from '../utils/formatters';

/**
 * ProductFilters component for filtering by category and sorting by price or rating.
 */
export function ProductFilters() {
  const selectedCategory = useProductStore((state) => state.selectedCategory);
  const sortBy = useProductStore((state) => state.sortBy);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const setSelectedCategory = useProductStore((state) => state.setSelectedCategory);
  const setSortBy = useProductStore((state) => state.setSortBy);
  const resetFilters = useProductStore((state) => state.resetFilters);
  const apiProducts = useProductStore((state) => state.apiProducts);
  const localProducts = useProductStore((state) => state.localProducts);

  // Compute unique sorted categories using useMemo to avoid unmemoized snapshot reference loops
  const categories = useMemo(() => {
    const categoriesSet = new Set();
    [...localProducts, ...apiProducts].forEach((p) => {
      if (p.category) {
        categoriesSet.add(p.category.toLowerCase());
      }
    });
    return Array.from(categoriesSet).sort();
  }, [apiProducts, localProducts]);

  const hasActiveFilters = Boolean(selectedCategory || sortBy || searchQuery);

  return (
    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
      {/* Category Filter Dropdown */}
      <div className="relative flex-1 sm:flex-initial min-w-[150px]">
        <label htmlFor="category-filter" className="sr-only">
          Filter by Category
        </label>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-xs appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {capitalize(cat)}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="relative flex-1 sm:flex-initial min-w-[170px]">
        <label htmlFor="sort-select" className="sr-only">
          Sort Products
        </label>
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-xs appearance-none cursor-pointer"
          >
            <option value="">Sort By (Default)</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
        </div>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors cursor-pointer"
          aria-label="Reset all search, category and sort filters"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
}

export default ProductFilters;
