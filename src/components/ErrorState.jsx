import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorState component for displaying user-friendly error messages and a Retry action.
 * @param {Object} props
 * @param {string} [props.message]
 * @param {Function} props.onRetry
 */
export function ErrorState({ message, onRetry }) {
  return (
    <div
      role="alert"
      className="w-full my-8 p-8 bg-red-50/70 border border-red-200 rounded-2xl flex flex-col items-center text-center shadow-xs"
    >
      <div className="p-3 bg-red-100 text-red-600 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-semibold text-red-900 mb-1">
        Failed to load products
      </h3>

      <p className="text-sm text-red-700 max-w-md mb-6 leading-relaxed">
        {message || 'An unexpected error occurred while fetching product data. Please check your network connection and try again.'}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Request
        </button>
      )}
    </div>
  );
}

export default ErrorState;
