import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { formatCurrency, formatRating, capitalize, getStockStatus } from '../utils/formatters';

/**
 * ProductTable component for desktop view layout.
 * @param {Object} props
 * @param {Array} props.products
 */
export function ProductTable({ products }) {
  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-xs">
      <table className="w-full text-left border-collapse">
        <caption className="sr-only">Product Inventory Table</caption>
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th scope="col" className="py-3.5 px-4 w-20">Image</th>
            <th scope="col" className="py-3.5 px-4">Product</th>
            <th scope="col" className="py-3.5 px-4">Category</th>
            <th scope="col" className="py-3.5 px-4">Price</th>
            <th scope="col" className="py-3.5 px-4">Stock Status</th>
            <th scope="col" className="py-3.5 px-4">Rating</th>
            <th scope="col" className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {products.map((product) => {
            const { id, title, price, category, rating, stock, thumbnail, brand } = product;
            const stockInfo = getStockStatus(stock);

            return (
              <tr
                key={id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Image */}
                <td className="py-3 px-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/60 flex items-center justify-center p-1">
                    <img
                      src={thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80'}
                      alt={`${title} thumbnail`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                  </div>
                </td>

                {/* Name & Brand */}
                <td className="py-3 px-4">
                  <div>
                    <span className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {title}
                    </span>
                    {brand && (
                      <span className="text-xs text-slate-400 block font-normal">
                        {brand}
                      </span>
                    )}
                  </div>
                </td>

                {/* Category */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                    {capitalize(category || 'Uncategorized')}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 whitespace-nowrap font-semibold text-slate-900">
                  {formatCurrency(price)}
                </td>

                {/* Stock Status */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border ${stockInfo.className}`}>
                    {stockInfo.label}
                  </span>
                </td>

                {/* Rating */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{formatRating(rating)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <Link
                    to={`/products/${id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    aria-label={`View details for ${title}`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View Details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
