'use client';

import { useState } from 'react';

export default function StudentOrdersPage() {
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      service: 'Market Run',
      runner: 'Chukwu O.',
      status: 'completed',
      amount: '₦500',
      date: '2026-03-09',
      rating: 4.8,
    },
    {
      id: 'ORD-002',
      service: 'Food Pickup',
      runner: 'Ada M.',
      status: 'in_progress',
      amount: '₦750',
      date: '2026-03-10',
      rating: null,
    },
    {
      id: 'ORD-003',
      service: 'Printing',
      runner: 'James K.',
      status: 'pending',
      amount: '₦300',
      date: '2026-03-10',
      rating: null,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your service requests</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'in_progress', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white border text-gray-700 hover:border-primary'
            }`}
          >
            {status.charAt(0).toUpperCase() +
              status.slice(1).replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Order</th>
                <th className="text-left px-6 py-4 font-semibold">Service</th>
                <th className="text-left px-6 py-4 font-semibold">Runner</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Amount</th>
                <th className="text-left px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">{order.service}</td>
                  <td className="px-6 py-4">{order.runner}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">{order.amount}</td>
                  <td className="px-6 py-4">
                    <a href={`/student/orders/${order.id}`} className="text-primary font-semibold hover:underline">
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
