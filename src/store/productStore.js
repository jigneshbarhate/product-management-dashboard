import { create } from 'zustand';

export const useProductStore = create((set) => ({
  // State
  searchQuery: '',
  selectedCategory: '',
  sortBy: '', // '', 'price-asc', 'price-desc', 'rating-asc', 'rating-desc'
  currentPage: 1,
  pageSize: 10,
  
  apiProducts: [],
  localProducts: [],
  isLoading: false,
  error: null,

  // Setters / Actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () => set({
    searchQuery: '',
    selectedCategory: '',
    sortBy: '',
    currentPage: 1,
  }),

  setApiProducts: (products) => set({ apiProducts: products, isLoading: false, error: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  addLocalProduct: (newProduct) => set((state) => ({
    localProducts: [newProduct, ...state.localProducts],
  })),
}));

export default useProductStore;
