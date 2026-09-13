import React, { useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { formatPKR } from '../utils/currency';
import { resolveImage } from '../utils/image';

const emptyForm = {
  name: '', description: '', price: '', compare_at_price: '', stock: 0,
  sku: '', category_id: '', is_active: true, is_featured: false
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const loadProducts = () => api.get('/products?limit=100').then(({ data }) => setProducts(data.products));
  const loadCategories = () => api.get('/categories').then(({ data }) => setCategories(data));

  useEffect(() => { loadProducts(); loadCategories(); }, []);

  const resetImageInput = () => {
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openNew = () => {
    setForm(emptyForm);
    setExistingImageUrl(null);
    resetImageInput();
    setEditingId(null);
    setError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, description: p.description || '', price: p.price,
      compare_at_price: p.compare_at_price || '', stock: p.stock, sku: p.sku || '',
      category_id: p.category_id || '', is_active: p.is_active, is_featured: p.is_featured
    });
    setExistingImageUrl(p.image_url || null);
    resetImageInput();
    setEditingId(p.id);
    setError('');
    setShowForm(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('compare_at_price', form.compare_at_price);
      fd.append('stock', form.stock);
      fd.append('sku', form.sku);
      fd.append('category_id', form.category_id);
      fd.append('is_active', form.is_active);
      fd.append('is_featured', form.is_featured);
      if (imageFile) fd.append('image', imageFile);

      if (editingId) {
        await api.put(`/products/${editingId}`, fd);
      } else {
        await api.post('/products', fd);
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  const previewUrl = imageFile ? URL.createObjectURL(imageFile) : resolveImage(existingImageUrl);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openNew} className="bg-panel text-white px-4 py-2 rounded text-sm">+ New Product</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 grid md:grid-cols-2 gap-4">
          {error && <p className="text-red-500 text-sm md:col-span-2">{error}</p>}

          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2" />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="border rounded px-3 py-2">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" step="1" placeholder="Price (Rs)" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded px-3 py-2" />
          <input type="number" step="1" placeholder="Compare at price (Rs, optional)" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} className="border rounded px-3 py-2" />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded px-3 py-2" />
          <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="border rounded px-3 py-2" />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No image</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
                className="text-sm"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Upload a photo from your computer (JPG, PNG, WEBP or GIF, max 5MB).</p>
          </div>

          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded px-3 py-2 md:col-span-2" rows="3" />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured
          </label>
          <div className="md:col-span-2 flex gap-3">
            <button disabled={saving} className="bg-panel text-white px-5 py-2 rounded disabled:opacity-50">
              {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 px-5 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {p.image_url ? (
                      <img src={resolveImage(p.image_url)} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </div>
                </td>
                <td className="font-medium">{p.name}</td>
                <td>{p.category_name || '—'}</td>
                <td>{formatPKR(p.price)}</td>
                <td>{p.stock}</td>
                <td>{p.is_active ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Hidden</span>}</td>
                <td className="p-3 space-x-3">
                  <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
