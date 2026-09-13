import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminProtectedRoute from './components/AdminProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Customers from './pages/Customers';

function AdminLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminProtectedRoute><AdminLayout><Dashboard /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/products" element={<AdminProtectedRoute><AdminLayout><Products /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/categories" element={<AdminProtectedRoute><AdminLayout><Categories /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/orders" element={<AdminProtectedRoute><AdminLayout><Orders /></AdminLayout></AdminProtectedRoute>} />
      <Route path="/customers" element={<AdminProtectedRoute><AdminLayout><Customers /></AdminLayout></AdminProtectedRoute>} />
    </Routes>
  );
}
