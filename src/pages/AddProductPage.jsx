import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import ProductForm from '../components/ProductForm';

export function AddProductPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Products Listing
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-indigo-600" />
            Add New Product
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill out the product information below to add a new item to your local inventory list.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <ProductForm />
    </div>
  );
}

export default AddProductPage;
