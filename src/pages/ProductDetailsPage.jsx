import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import productService from '../services/productService';
import useProductStore from '../store/productStore';
import { formatCurrency, formatRating, capitalize, getStockStatus } from '../utils/formatters';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export function ProductDetailsPage() {
  const { id } = useParams();
  const apiProducts = useProductStore((state) => state.apiProducts);
  const localProducts = useProductStore((state) => state.localProducts);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setError(null);

      // Check if product exists in global Zustand store first
      const storeProduct = [...localProducts, ...apiProducts].find(
        (p) => String(p.id) === String(id)
      );

      if (storeProduct) {
        if (isMounted) {
          setProduct(storeProduct);
          setIsLoading(false);
        }
        return;
      }

      // Otherwise fetch from API
      try {
        const data = await productService.getProductById(id);
        if (isMounted) {
          setProduct(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to retrieve product details.');
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id, apiProducts, localProducts]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <LoadingState />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <ErrorState
          message={error || 'Product not found.'}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const {
    title,
    description,
    category,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    thumbnail,
    images,
  } = product;

  const stockInfo = getStockStatus(stock);

  // Compute discounted price if discountPercentage exists
  const hasDiscount = Boolean(discountPercentage && discountPercentage > 0);
  const originalPrice = hasDiscount
    ? price / (1 - discountPercentage / 100)
    : price;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back to Products Navigation */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
          aria-label="Back to Product Inventory"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery / Display */}
          <div className="space-y-4">
            <div className="w-full pt-[80%] relative bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center p-6">
              <img
                src={thumbnail || (images && images[0]) || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                alt={`${title} detail`}
                className="absolute inset-0 w-full h-full object-contain p-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
                }}
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Category Header Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                {brand && (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-md">
                    {brand}
                  </span>
                )}
                <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-md">
                  {capitalize(category || 'Uncategorized')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>

              {/* Rating & Stock Status */}
              <div className="flex items-center gap-4 flex-wrap pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-lg text-amber-700 font-semibold text-sm">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span>{formatRating(rating)} / 5.0</span>
                </div>

                <span className={`px-3 py-1 text-xs font-medium rounded-lg border ${stockInfo.className}`}>
                  {stockInfo.label}
                </span>
              </div>

              {/* Price & Discount Display */}
              <div className="pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {formatCurrency(price)}
                  </span>

                  {hasDiscount && (
                    <>
                      <span className="text-lg text-slate-400 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-md">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {description || 'No detailed description available for this product.'}
                </p>
              </div>
            </div>

            {/* Product Meta Info Cards */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="block font-semibold text-slate-900">Authentic</span>
                  <span className="text-slate-500">Verified inventory</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2.5">
                <Truck className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="block font-semibold text-slate-900">Stock Status</span>
                  <span className="text-slate-500">{stock} units remaining</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex items-center gap-4">
              <Link
                to="/"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Product Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
