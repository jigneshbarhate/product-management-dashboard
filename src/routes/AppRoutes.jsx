import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingState from '../components/LoadingState';

// Route Lazy Loading using React.lazy
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const AddProductPage = lazy(() => import('../pages/AddProductPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/products/add" element={<AddProductPage />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
