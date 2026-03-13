'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { Package, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

interface Order {
  id: string;
  title: string;
  status: string;
  final_amount: number;
  created_at: string;
  service_category_id: string;
  service_categories: { name: string } | null;
}

export default function StudentOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, title, status, final_amount, created_at, service_category_id')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const ordersWithCategories = await Promise.all(
        (data || []).map(async (order) => {
          if (order.service_category_id) {
            const { data: cat } = await supabase
              .from('service_categories')
              .select('name')
              .eq('id', order.service_category_id)
              .single();
            return { ...order, service_categories: cat };
          }
          return { ...order, service_categories: null };
        })
      );

      setOrders(ordersWithCategories);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'accepted': return 'bg-blue-50 text-blue-700';
      case 'in_progress': return 'bg-purple-50 text-purple-700';
      case 'completed': return 'bg-green-50 text-green-700';
      case 'cancelled': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);
  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['accepted', 'in_progress'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{counts.all} total orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'active', label: 'Active', count: counts.active },
            { key: 'completed', label: 'Done', count: counts.completed },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-[#6200EE] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label} {tab.count > 0 && `(${tab.count})`}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      <div className="p-4 space-y-3">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <Link
              key={order.id}
              href={`/student/orders/${order.id}`}
              className="block bg-white rounded-2xl p-4 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{order.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {order.service_categories?.name || 'Service'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ml-3 ${getStatusColor(order.status)}`}>
                  {order.status === 'in_progress' ? 'In Progress' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#6200EE]">₦{order.final_amount.toLocaleString()}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No orders found</p>
            <Link
              href="/student/create-order"
              className="inline-block px-6 py-2.5 bg-[#6200EE] text-white font-medium rounded-full"
            >
              Create Order
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
