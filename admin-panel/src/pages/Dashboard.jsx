import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatPKR } from '../utils/currency';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data));
  }, []);

  if (!stats) return <p className="text-gray-400">Loading dashboard...</p>;

  const cards = [
    { label: 'Total Revenue', value: formatPKR(stats.total_revenue) },
    { label: 'Total Orders', value: stats.total_orders },
    { label: 'Total Products', value: stats.total_products },
    { label: 'Total Customers', value: stats.total_customers },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-400">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-3">Recent Orders</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="py-2">Order</th><th>Customer</th><th>Total</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="py-2">#{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{formatPKR(o.total_amount)}</td>
                  <td className="capitalize">{o.status}</td>
                </tr>
              ))}
              {stats.recent_orders.length === 0 && (
                <tr><td colSpan="4" className="text-gray-400 py-3">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold mb-3">Low Stock Alert</h2>
          <ul className="text-sm space-y-2">
            {stats.low_stock_products.map((p) => (
              <li key={p.id} className="flex justify-between border-b last:border-0 pb-2">
                <span>{p.name}</span>
                <span className="text-red-500 font-medium">{p.stock} left</span>
              </li>
            ))}
            {stats.low_stock_products.length === 0 && <li className="text-gray-400">All products well stocked.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
