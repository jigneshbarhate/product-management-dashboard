import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Plus, LayoutGrid } from 'lucide-react';

/**
 * MainLayout wrapper providing sticky responsive header, container, and footer.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export function MainLayout({ children }) {
  const location = useLocation();
  const isAddPage = location.pathname === '/products/add';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
          >
            <div className="h-9 w-9 bg-indigo-600 group-hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-xs transition-colors">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors block leading-tight">
                Product Hub
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
                Dashboard
              </span>
            </div>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">All Products</span>
            </Link>

            {!isAddPage && (
              <Link
                to="/products/add"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>

      {/* Responsive Footer */}
      <footer className="w-full bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Product Hub Management Dashboard. Powered by DummyJSON API.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Responsive Layout</span>
            <span>•</span>
            <span>Client-side Pagination</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
