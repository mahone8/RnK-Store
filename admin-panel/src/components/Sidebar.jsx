import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const links = [
  { to: '/', label: '📊 Dashboard', end: true },
  { to: '/products', label: '👛 Products' },
  { to: '/categories', label: '🗂️ Categories' },
  { to: '/orders', label: '📦 Orders' },
  { to: '/customers', label: '👥 Customers' },
];

export default function Sidebar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-panel text-white flex flex-col min-h-screen">
      <div className="px-6 py-5 border-b border-white/10">
        <img src="/logo-mark.png" alt="R&K" className="h-10 w-auto object-contain mb-1" />
        <p className="text-xs text-panel-accent tracking-widest uppercase">Admin Panel</p>
        <p className="text-xs text-gray-400 mt-1">{admin?.name}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `block px-4 py-2 rounded text-sm font-medium ${
                isActive ? 'bg-panel-accent text-black' : 'hover:bg-white/10'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full bg-white/10 hover:bg-white/20 py-2 rounded text-sm"
        >
          Logout
        </button>
        <p className="text-[10px] text-gray-500 text-center mt-4">
          Developed by{' '}
          <a
            href="https://levelose.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-panel-accent hover:underline"
          >
            levelose.tech
          </a>
        </p>
      </div>
    </aside>
  );
}
