import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const load = () => api.get('/categories').then(({ data }) => setCategories(data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/categories/${editingId}`, form);
    } else {
      await api.post('/categories', form);
    }
    setForm({ name: '', description: '' });
    setEditingId(null);
    load();
  };

  const handleEdit = (c) => { setForm({ name: c.name, description: c.description || '' }); setEditingId(c.id); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col md:flex-row gap-3">
        <input placeholder="Category name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded px-3 py-2 flex-1" />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded px-3 py-2 flex-1" />
        <button className="bg-panel text-white px-5 py-2 rounded">{editingId ? 'Update' : 'Add'}</button>
        {editingId && (
          <button type="button" onClick={() => { setForm({ name: '', description: '' }); setEditingId(null); }} className="bg-gray-200 px-5 py-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded-lg shadow divide-y">
        {categories.map((c) => (
          <div key={c.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-gray-400">{c.description}</p>
            </div>
            <div className="space-x-3 text-sm">
              <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
