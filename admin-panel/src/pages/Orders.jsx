import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatPKR } from '../utils/currency';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    const params = filter ? { status: filter } : {};
    api.get('/orders', { params }).then(({ data }) => setOrders(data));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  const toggleExpand = async (order) => {
    if (expanded === order.id) return setExpanded(null);
    const { data } = await api.get(`/orders/${order.id}`);
    setExpanded(order.id);
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, items: data.items } : o)));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow">
            <div className="p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleExpand(order)}>
              <div>
                <p className="font-semibold">Order #{order.id} — {order.customer_name}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()} • {formatPKR(order.total_amount)}</p>
              </div>
              <select
                value={order.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded px-3 py-1.5 text-sm capitalize"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {expanded === order.id && order.items && (
              <div className="border-t p-4 text-sm space-y-2 bg-gray-50">
                <p className="text-gray-500 mb-2">Ship to: {order.shipping_name}, {order.shipping_address}, {order.shipping_city} ({order.shipping_phone})</p>
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 border-b last:border-0 pb-2">
                    <div>
                      <p>{item.product_name} × {item.quantity}</p>
                      {item.product_description && (
                        <p className="text-xs text-gray-400 mt-0.5 max-w-md">{item.product_description}</p>
                      )}
                    </div>
                    <span className="shrink-0">{formatPKR(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-400">No orders found.</p>}
      </div>
    </div>
  );
}
