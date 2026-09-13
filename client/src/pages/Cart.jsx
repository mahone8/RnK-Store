import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/currency';
import { resolveImage } from '../utils/image';
import { truncate } from '../utils/text';

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty.</p>
        <Link to="/shop" className="text-brand-gold font-semibold">Continue Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between border-b pb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0">
                {item.image_url && (
                  <img src={resolveImage(item.image_url)} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-0.5 max-w-xs">{truncate(item.description, 90)}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">{formatPKR(item.price)} each</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-16 border border-gray-300 rounded px-2 py-1"
              />
              <span className="w-24 text-right font-semibold">{formatPKR(item.price * item.quantity)}</span>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <div className="w-full md:w-80">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-brand text-white py-3 rounded font-semibold hover:bg-gray-800"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
