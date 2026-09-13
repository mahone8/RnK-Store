import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPKR } from '../utils/currency';
import { resolveImage } from '../utils/image';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => setProduct(data)).catch(() => setProduct(null));
  }, [slug]);

  if (!product) return <div className="max-w-6xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>;

  const handleAdd = async () => {
    if (!user) return navigate('/login');
    await addToCart(product.id, qty);
    setMessage('Added to cart!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {product.image_url ? (
          <img src={resolveImage(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">No image</span>
        )}
      </div>
      <div>
        <p className="text-xs uppercase text-gray-400">{product.category_name}</p>
        <h1 className="text-3xl font-bold text-brand mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-brand-gold">{formatPKR(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-gray-400 line-through">{formatPKR(product.compare_at_price)}</span>
          )}
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
        <p className="text-sm mb-4 text-gray-500">
          {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
        </p>

        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium">Qty:</label>
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))}
            className="w-16 border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <button
          disabled={product.stock === 0}
          onClick={handleAdd}
          className="bg-brand text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          Add to Cart
        </button>
        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
