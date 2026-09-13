import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/currency';
import { truncate } from '../utils/text';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_name: '', shipping_address: '', shipping_city: 'Faisalabad', shipping_phone: '', payment_method: 'cod'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/orders', form);
      await clearCart();
      navigate('/orders', { state: { success: true, orderId: data.id } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold mb-2">Shipping Details</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <input name="shipping_name" placeholder="Full Name" required value={form.shipping_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="shipping_address" placeholder="Address" required value={form.shipping_address} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="shipping_city" placeholder="City" required value={form.shipping_city} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        <input name="shipping_phone" placeholder="Phone Number" required value={form.shipping_phone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        <select name="payment_method" value={form.payment_method} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
          <option value="cod">Cash on Delivery</option>
          <option value="card">Card (mock)</option>
        </select>
        <button disabled={submitting} className="w-full bg-brand text-white py-3 rounded font-semibold hover:bg-gray-800 disabled:opacity-50">
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm border-b pb-3">
              <div>
                <p className="font-medium">{item.name} × {item.quantity}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5 max-w-xs">{truncate(item.description, 90)}</p>
                )}
              </div>
              <span className="shrink-0">{formatPKR(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold text-lg mt-4 pt-4">
          <span>Total</span>
          <span>{formatPKR(total)}</span>
        </div>
      </div>
    </div>
  );
}
