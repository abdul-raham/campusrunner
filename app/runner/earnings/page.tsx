'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { DollarSign, TrendingUp, Package, Calendar } from 'lucide-react';
import { PageLoader } from '@/components/PageLoader';

interface CompletedOrder {
  id: string;
  title: string;
  final_amount: number;
  completed_at: string;
  service_categories: { name: string } | null;
}

export default function RunnerEarningsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<CompletedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (user) fetchEarnings();
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, title, final_amount, completed_at, service_category_id')
        .eq('runner_id', user?.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

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
      const total = ordersWithCategories.reduce((sum, order) => sum + order.final_amount, 0);
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyEarnings = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return orders
      .filter(order => {
        const orderDate = new Date(order.completed_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.final_amount, 0);
  };

  if (loading) return <PageLoader />;

  const monthlyEarnings = getMonthlyEarnings();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Earnings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} completed jobs</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#6200EE] to-[#03DAC5] rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="text-sm font-medium">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold">₦{totalEarnings.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#6200EE]" />
              <span className="text-sm font-medium text-gray-600">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">₦{monthlyEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Earnings History</h2>
          
          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{order.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">{order.service_categories?.name}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className="font-bold text-green-600">+₦{order.final_amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No completed jobs yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
