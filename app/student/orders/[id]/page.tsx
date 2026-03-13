'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabase/client';
import { ArrowLeft, MapPin, Phone, Package, Clock } from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

interface OrderDetails {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  created_at: string;
  accepted_at: string | null;
  completed_at: string | null;
  pickup_location: string;
  delivery_location: string;
  notes: string | null;
  service_categories: { name: string } | null;
  profiles: { full_name: string; phone: string } | null;
  order_items: { id: string; item_name: string; quantity: number }[];
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 20000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      if (!orderData) {
        setOrder(null);
        return;
      }

      let serviceCategory = null;
      if (orderData.service_category_id) {
        const { data: catData } = await supabase
          .from('service_categories')
          .select('name')
          .eq('id', orderData.service_category_id)
          .single();
        serviceCategory = catData;
      }

      let runnerProfile = null;
      if (orderData.runner_id) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, phone')
          .eq('id', orderData.runner_id)
          .single();
        runnerProfile = profileData;
      }

      const { data: itemsData } = await supabase
        .from('order_items')
        .select('id, item_name, quantity')
        .eq('order_id', orderId);

      setOrder({
        ...orderData,
        service_categories: serviceCategory,
        profiles: runnerProfile,
        order_items: itemsData || []
      });
    } catch (error) {
      console.error('Error:', error);
      setOrder(null);
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

  const getTimelineSteps = () => {
    return [
      { label: 'Created', completed: true, time: order?.created_at },
      { label: 'Accepted', completed: !!order?.accepted_at, time: order?.accepted_at },
      { label: 'In Progress', completed: order?.status === 'in_progress' || !!order?.completed_at, time: null },
      { label: 'Completed', completed: !!order?.completed_at, time: order?.completed_at }
    ];
  };

  if (loading) return <PageLoader />;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Order not found</p>
          <Link href="/student/orders" className="text-[#6200EE] font-medium">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const timelineSteps = getTimelineSteps();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <Link href="/student/orders" className="flex items-center gap-2 text-gray-600 mb-3">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-gray-900">{order.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status === 'in_progress' ? 'In Progress' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{order.service_categories?.name}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Timeline */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-[#6200EE]' : 'bg-gray-200'
                  }`}>
                    {step.completed && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`w-0.5 h-8 ${step.completed ? 'bg-[#6200EE]' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(step.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items */}
        {order.order_items.length > 0 && (
          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
            <div className="space-y-2">
              {order.order_items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#6200EE]/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#6200EE]">{item.quantity}x</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.item_name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        <div className="bg-white rounded-2xl p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Locations</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Pickup</p>
                <p className="text-sm text-gray-900">{order.pickup_location}</p>
              </div>
            </div>
            {order.delivery_location && (
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivery</p>
                  <p className="text-sm text-gray-900">{order.delivery_location}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Runner */}
        {order.profiles && (
          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Runner</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6200EE] to-[#03DAC5] flex items-center justify-center text-white font-bold">
                  {order.profiles.full_name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.profiles.full_name}</p>
                  <p className="text-xs text-gray-500">Campus Runner</p>
                </div>
              </div>
              <a
                href={`tel:${order.profiles.phone}`}
                className="w-10 h-10 rounded-full bg-[#6200EE] flex items-center justify-center"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        )}

        {/* Price */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-2xl font-bold text-[#6200EE]">₦{order.final_amount.toLocaleString()}</span>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="bg-white rounded-2xl p-4">
            <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-sm text-gray-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
