import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import { formatPKR } from '../utils/currency';
import { truncate } from '../utils/text';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const location = useLocation();

  useEffect(() => {
    api.get('/orders/mine').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {location.state?.success && (
        <p className="bg-green-50 text-green-700 border border-green-200 rounded px-4 py-2 mb-6">
          Order #{location.state.orderId} placed successfully!
        </p>
      )}
      {orders.length === 0 && <p className="text-gray-400">You have no orders yet.</p>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full capitalize ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border-b last:border-0 pb-2">
                  <div>
                    <p>{item.product_name} × {item.quantity}</p>
                    {item.product_description && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs">{truncate(item.product_description, 90)}</p>
                    )}
                  </div>
                  <span className="shrink-0">{formatPKR(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>{formatPKR(order.total_amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
