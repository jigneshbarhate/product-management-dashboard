import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
