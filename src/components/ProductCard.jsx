import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye } from 'lucide-react';
import { formatCurrency, formatRating, capitalize, getStockStatus } from '../utils/formatters';

/**
 * ProductCard component used for mobile/tablet card view layout.
 * @param {Object} props
 * @param {Object} props.product
 */
export function ProductCard({ product }) {
  const { id, title, price, category, rating, stock, thumbnail, brand } = product;
  const stockInfo = getStockStatus(stock);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative w-full pt-[65%] bg-slate-100 overflow-hidden group">
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'}
          alt={`${title} thumbnail`}
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
          }}
        />
        {/* Category Badge overlay */}
        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 text-xs font-semibold bg-white/95 backdrop-blur-xs text-slate-700 rounded-md border border-slate-200/80 shadow-2xs">
          {capitalize(category || 'Uncategorized')}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand */}
          {brand && (
            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">
              {brand}
            </p>
          )}

          {/* Title */}
          <h3 className="text-base font-semibold text-slate-900 line-clamp-1 hover:text-indigo-600 transition-colors">
            {title}
          </h3>
        </div>

        {/* Rating and Stock */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1 text-amber-500 font-semibold bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{formatRating(rating)}</span>
          </div>

          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${stockInfo.className}`}>
            {stockInfo.label}
          </span>
        </div>

        {/* Price and Details Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block font-normal">Price</span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(price)}
            </span>
          </div>

          <Link
            to={`/products/${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            aria-label={`View details for ${title}`}
          >
            <Eye className="h-3.5 w-3.5" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
