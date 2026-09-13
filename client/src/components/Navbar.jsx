import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
  { name: 'Wallets', slug: 'wallets' },
  { name: 'Bracelets', slug: 'bracelets' },
  { name: 'Caps', slug: 'caps' },
  { name: 'Glasses', slug: 'glasses' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="bg-brand text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/logo-mark.png" alt="R&K" className="h-11 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {categories.map((c) => (
            <Link key={c.slug} to={`/shop?category=${c.slug}`} className="hover:text-brand-gold transition">
              {c.name}
            </Link>
          ))}
          <Link to="/shop" className="hover:text-brand-gold transition">All Products</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative hover:text-brand-gold transition">
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand-gold text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <Link to="/orders" className="hover:text-brand-gold transition">My Orders</Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="bg-brand-gold text-black px-3 py-1 rounded hover:opacity-90"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-brand-gold text-black px-3 py-1 rounded text-sm hover:opacity-90">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
