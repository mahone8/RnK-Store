import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" placeholder="Full Name" required
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="email" placeholder="Email" required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <input
          type="password" placeholder="Password (min 6 chars)" required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button className="w-full bg-brand text-white py-2.5 rounded font-semibold hover:bg-gray-800">Register</button>
      </form>
      <p className="text-sm text-center mt-4 text-gray-500">
        Already have an account? <Link to="/login" className="text-brand-gold font-medium">Login</Link>
      </p>
    </div>
  );
}
