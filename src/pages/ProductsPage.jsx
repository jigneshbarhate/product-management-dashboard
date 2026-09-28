import React, { useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package } from 'lucide-react';
import useProductStore from '../store/productStore';
import productService from '../services/productService';
import SearchBar from '../components/SearchBar';
import ProductFilters from '../components/ProductFilters';
import ProductTable from '../components/ProductTable';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export function ProductsPage() {
  const apiProducts = useProductStore((state) => state.apiProducts);
  const localProducts = useProductStore((state) => state.localProducts);
  const searchQuery = useProductStore((state) => state.searchQuery);
  const selectedCategory = useProductStore((state) => state.selectedCategory);
  const sortBy = useProductStore((state) => state.sortBy);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const currentPage = useProductStore((state) => state.currentPage);
  const pageSize = useProductStore((state) => state.pageSize);
  
  const setApiProducts = useProductStore((state) => state.setApiProducts);
  const setIsLoading = useProductStore((state) => state.setIsLoading);
  const setError = useProductStore((state) => state.setError);
  const setCurrentPage = useProductStore((state) => state.setCurrentPage);

  // Fetch API products on initial mount
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts();
      setApiProducts(data);
    } catch (err) {
      setError(
        err.message || 'Unable to connect to product server. Please check your network and try again.'
      );
    }
  }, [setApiProducts, setIsLoading, setError]);

  useEffect(() => {
    if (apiProducts.length === 0) {
      fetchProducts();
    }
  }, [apiProducts.length, fetchProducts]);

  // Compute filtered and sorted products list using useMemo
  const filteredProducts = useMemo(() => {
    let result = [...localProducts, ...apiProducts];

    // Filter by Search Query (Product Name / Brand / Category)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (product) =>
          (product.title && product.title.toLowerCase().includes(query)) ||
          (product.brand && product.brand.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = selectedCategory.toLowerCase();
      result = result.filter(
        (product) => product.category && product.category.toLowerCase() === cat
      );
    }

    // Sort by Price or Rating
    if (sortBy === 'price-asc') {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === 'rating-asc') {
      result.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return result;
  }, [apiProducts, localProducts, searchQuery, selectedCategory, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Paginated subset
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  return (
    <div className="space-y-6">
      {/* Top Header Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-indigo-600" />
            Product Inventory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, search, filter and monitor products from your inventory catalog.
          </p>
        </div>

        <Link
          to="/products/add"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <SearchBar />
        <ProductFilters />
      </div>

      {/* Main Content Area based on State */}
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchProducts} />
      ) : totalItems === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Mobile & Tablet Card Layout (Visible on screens smaller than md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Desktop Table Layout (Visible on md screens and larger) */}
          <div className="hidden md:block">
            <ProductTable products={paginatedProducts} />
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
