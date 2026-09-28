import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * LoadingState component showing skeleton placeholders and spinner.
 */
export function LoadingState() {
  return (
    <div
      role="status"
      aria-label="Loading products"
      className="w-full py-12 flex flex-col items-center justify-center space-y-6"
    >
      {/* Animated Spinner Icon */}
      <div className="flex items-center gap-3 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-xs">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">Fetching products...</span>
      </div>

      {/* Skeleton Cards / Rows Placeholder */}
      <div className="w-full space-y-3 mt-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="w-full h-16 bg-slate-100 rounded-lg animate-pulse border border-slate-200/60"
          />
        ))}
      </div>
      
      <span className="sr-only">Loading products, please wait...</span>
    </div>
  );
}

export default LoadingState;
