'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { ArrowLeft, User, Package, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  platform_fee: number;
  runner_payout: number;
  created_at: string;
  updated_at: string;
  student_id: string;
  runner_id: string | null;
  service_category_id: string;
  pickup_location: string;
  delivery_location: string;
  service_categories: {
    name: string;
    description: string;
  } | null;
  student_profile: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  runner_profile: {
    full_name: string;
    email: string;
    phone: string;
  } | null;
  order_items: Array<{
    id: string;
    item_name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchOrderDetail(params.id as string);
    }
  }, [params.id]);

  const fetchOrderDetail = async (orderId: string) => {
    try {
      // Simplified query first
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          title,
          description,
          status,
          final_amount,
          platform_fee,
          runner_payout,
          created_at,
          updated_at,
          student_id,
          runner_id,
          pickup_location,
          delivery_location
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Order Supabase error:', error);
        throw error;
      }
      
      // Get profiles separately
      let studentProfile = null;
      let runnerProfile = null;

      if (data.student_id) {
        const { data: student } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', data.student_id)
          .single();
        studentProfile = student;
      }

      if (data.runner_id) {
        const { data: runner } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', data.runner_id)
          .single();
        runnerProfile = runner;
      }
      
      // Get order items separately
      const { data: items } = await supabase
        .from('order_items')
        .select('id, item_name, quantity, price')
        .eq('order_id', orderId);

      setOrder({
        ...data,
        service_category_id: 'general', // Add missing field
        service_categories: {
          name: 'General Service',
          description: 'Service description'
        },
        student_profile: studentProfile,
        runner_profile: runnerProfile,
        order_items: items || []
      });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 border-green-200 text-green-700';
      case 'in_progress': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'accepted': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-[#6200EE]/20 border-t-[#6200EE]"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-[#6B7280]"
          >
            Loading Order Details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0B0E11] mb-2">Order Not Found</h2>
          <p className="text-[#6B7280] mb-4">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#6200EE] text-white rounded-xl font-semibold hover:bg-[#4F2EE8]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#0B0E11] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>
        <h1 className="text-3xl font-black text-[#0B0E11]">Order Details</h1>
        <p className="text-[#6B7280] mt-2">Order ID: {order.id}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
            <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#0B0E11] text-lg">{order.title}</h3>
                <p className="text-[#6B7280] mt-1">{order.description}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#6B7280]" />
                <span className="text-[#6B7280]">Service:</span>
                <span className="font-semibold">{order.service_categories?.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`inline-block px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
              <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-[#E9E4FF] last:border-b-0">
                    <div>
                      <span className="font-semibold text-[#0B0E11]">{item.item_name}</span>
                      <span className="text-[#6B7280] ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#0B0E11]">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
            <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-[#6B7280]" />
                <div>
                  <p className="font-semibold text-[#0B0E11]">Order Created</p>
                  <p className="text-sm text-[#6B7280]">{new Date(order.created_at).toLocaleString()}</p>
                </div>
              </div>
              {order.updated_at !== order.created_at && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#6B7280]" />
                  <div>
                    <p className="font-semibold text-[#0B0E11]">Last Updated</p>
                    <p className="text-sm text-[#6B7280]">{new Date(order.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
            <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Total Amount:</span>
                <span className="font-semibold text-[#0B0E11]">₦{(order.final_amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Platform Fee:</span>
                <span className="font-semibold text-[#0B0E11]">₦{(order.platform_fee || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Runner Payout:</span>
                <span className="font-semibold text-[#0B0E11]">₦{(order.runner_payout || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
            <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Student</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#6B7280]" />
                <span className="font-semibold text-[#0B0E11]">{order.student_profile?.full_name}</span>
              </div>
              <p className="text-sm text-[#6B7280]">{order.student_profile?.email}</p>
              <p className="text-sm text-[#6B7280]">{order.student_profile?.phone}</p>
            </div>
          </div>

          {order.runner_profile && (
            <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 p-6">
              <h2 className="text-xl font-bold text-[#0B0E11] mb-4">Runner</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#6B7280]" />
                  <span className="font-semibold text-[#0B0E11]">{order.runner_profile.full_name}</span>
                </div>
                <p className="text-sm text-[#6B7280]">{order.runner_profile.email}</p>
                <p className="text-sm text-[#6B7280]">{order.runner_profile.phone}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}