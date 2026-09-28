import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle, RotateCcw, XCircle, PlusCircle } from 'lucide-react';
import productService from '../services/productService';
import useProductStore from '../store/productStore';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  brand: '',
  thumbnail: '',
};

/**
 * ProductForm component for adding new products with complete validation and accessibility.
 */
export function ProductForm() {
  const navigate = useNavigate();
  const addLocalProduct = useProductStore((state) => state.addLocalProduct);
  const apiProducts = useProductStore((state) => state.apiProducts);
  const localProducts = useProductStore((state) => state.localProducts);

  // Compute categories using useMemo
  const categories = useMemo(() => {
    const set = new Set();
    [...localProducts, ...apiProducts].forEach((p) => {
      if (p.category) {
        set.add(p.category.toLowerCase());
      }
    });
    return Array.from(set).sort();
  }, [apiProducts, localProducts]);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Validate individual field or all fields
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'title':
        if (!value || !value.trim()) {
          error = 'Product name is required.';
        } else if (value.trim().length < 3) {
          error = 'Product name must be at least 3 characters.';
        }
        break;

      case 'description':
        if (!value || !value.trim()) {
          error = 'Description is required.';
        } else if (value.trim().length < 10) {
          error = 'Description must be at least 10 characters.';
        }
        break;

      case 'category':
        if (!value || !value.trim()) {
          error = 'Category is required.';
        }
        break;

      case 'price':
        if (!value && value !== 0) {
          error = 'Price is required.';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          error = 'Price must be a number greater than 0.';
        }
        break;

      case 'stock':
        if (!value && value !== 0) {
          error = 'Stock quantity is required.';
        } else if (isNaN(value) || parseInt(value, 10) < 0) {
          error = 'Stock quantity cannot be negative.';
        }
        break;

      case 'brand':
        if (!value || !value.trim()) {
          error = 'Brand name is required.';
        }
        break;

      case 'thumbnail':
        if (!value || !value.trim()) {
          error = 'Product image URL is required.';
        } else {
          try {
            new URL(value);
          } catch (_) {
            error = 'Please enter a valid URL (e.g. https://example.com/image.jpg).';
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setTouched({});
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Send POST request to API
      const apiResponse = await productService.addProduct(formData);

      // Create product object for local Zustand store
      const newProduct = {
        id: apiResponse.id || `local-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.toLowerCase().trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        brand: formData.brand.trim(),
        rating: 5.0, // New products start with 5.0 rating
        thumbnail: formData.thumbnail.trim(),
      };

      // Add product to local Zustand store
      addLocalProduct(newProduct);

      setSubmitSuccess(true);
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
      setTouched({});
    } catch (error) {
      setSubmitError(
        error.message || 'Failed to submit product to server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto">
      {/* Top Banner Feedback */}
      {submitSuccess && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800"
        >
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-emerald-900">Product created successfully!</p>
            <p className="mt-0.5 text-emerald-700">
              The new product has been added to your local inventory list and is now visible on the product listing page.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
              >
                Go to Product Listing &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {submitError && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800"
        >
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-red-900">Failed to create product</p>
            <p className="mt-0.5 text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="field-title"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="field-title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'err-title' : undefined}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.title && (
              <p id="err-title" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Brand Name */}
          <div>
            <label
              htmlFor="field-brand"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              id="field-brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.brand)}
              aria-describedby={errors.brand ? 'err-brand' : undefined}
              placeholder="e.g. Sony, Apple, Nike"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.brand
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.brand && (
              <p id="err-brand" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.brand}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="field-category"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <input
              id="field-category"
              name="category"
              type="text"
              list="category-suggestions"
              value={formData.category}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'err-category' : undefined}
              placeholder="e.g. electronics, beauty, furniture"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.category
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            <datalist id="category-suggestions">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && (
              <p id="err-category" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="field-price"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Price ($ USD) <span className="text-red-500">*</span>
            </label>
            <input
              id="field-price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.price)}
              aria-describedby={errors.price ? 'err-price' : undefined}
              placeholder="99.99"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.price
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.price && (
              <p id="err-price" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.price}
              </p>
            )}
          </div>

          {/* Stock Quantity */}
          <div>
            <label
              htmlFor="field-stock"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="field-stock"
              name="stock"
              type="number"
              step="1"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? 'err-stock' : undefined}
              placeholder="50"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.stock
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.stock && (
              <p id="err-stock" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.stock}
              </p>
            )}
          </div>

          {/* Product Image URL */}
          <div className="sm:col-span-2">
            <label
              htmlFor="field-thumbnail"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Product Image URL <span className="text-red-500">*</span>
            </label>
            <input
              id="field-thumbnail"
              name="thumbnail"
              type="url"
              value={formData.thumbnail}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={errors.thumbnail ? 'err-thumbnail' : undefined}
              placeholder="https://images.unsplash.com/photo-..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.thumbnail
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.thumbnail && (
              <p id="err-thumbnail" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.thumbnail}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="field-description"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="field-description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? 'err-description' : undefined}
              placeholder="Write a clear and comprehensive description of the product features..."
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.description
                  ? 'border-red-400 focus:ring-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {errors.description && (
              <p id="err-description" className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-xs disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Product...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Add Product
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-4 w-4 text-slate-400" />
              Reset Form
            </button>
          </div>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-slate-600 hover:text-slate-900 font-medium text-sm rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors cursor-pointer"
          >
            <XCircle className="h-4 w-4 text-slate-400" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
