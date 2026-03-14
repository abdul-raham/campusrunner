'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  ChevronRight, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Truck,
  MapPin,
  User,
  Calendar,
  DollarSign,
  Eye,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { PageLoader } from '@/components/PageLoader';

interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  platform_fee: number;
  created_at: string;
  updated_at: string;
  pickup_location: string;
  delivery_location: string;
  urgency_level: string;
  service_category_id: string;
  runner_id: string | null;
  service_categories: { name: string; icon_name: string } | null;
  runner_profile: { full_name: string } | null;
}

export default function StudentOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, 
          title, 
          description,
          status, 
          final_amount, 
          platform_fee,
          created_at, 
          updated_at,
          pickup_location,
          delivery_location,
          urgency_level,
          service_category_id,
          runner_id,
          service_categories (name, icon_name),
          runner_profile:profiles!runner_id (full_name)
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'accepted': return CheckCircle2;
      case 'in_progress': return Truck;
      case 'completed': return Package;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'accepted': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'in_progress': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    return urgency === 'urgent' 
      ? 'text-red-600 bg-red-50 border-red-200' 
      : 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service_categories?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && ['accepted', 'in_progress'].includes(order.status)) ||
                         order.status === filter;
    return matchesSearch && matchesFilter;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    active: orders.filter(o => ['accepted', 'in_progress'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const handleRefresh = async () => {
    await fetchOrders();
  };

  if (loading) return <PageLoader />;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-3 py-4 md:px-8 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-black text-[#0B0E11] sm:text-4xl">My Orders</h1>
            <p className="text-[#6B7280] mt-2">
              Track and manage all your service requests
              {counts.all > 0 && (
                <span className="ml-2 px-2 py-1 bg-[#6200EE]/10 text-[#6200EE] text-xs font-bold rounded-full">
                  {counts.all} total orders
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-white/50 border border-[#E9E4FF] text-[#6B7280] font-semibold rounded-xl hover:bg-[#F4ECFF] hover:text-[#6200EE] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            <Link href="/student/create-order">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                <Package className="w-4 h-4" />
                New Order
              </motion.button>
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search orders by title, description, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl focus:border-[#6200EE] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'pending', label: 'Pending', count: counts.pending },
              { key: 'active', label: 'Active', count: counts.active },
              { key: 'completed', label: 'Completed', count: counts.completed },
              { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white shadow-lg'
                    : 'bg-white/50 text-[#6B7280] border border-[#E9E4FF] hover:bg-[#F4ECFF] hover:text-[#6200EE]'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, idx) => {
            const StatusIcon = getStatusIcon(order.status);
            const statusColorClass = getStatusColor(order.status);
            const urgencyColorClass = getUrgencyColor(order.urgency_level);
            
            return (
              <motion.div
                key={order.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                className="group rounded-2xl border border-[#E9E4FF] backdrop-blur-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-white/70 hover:bg-white/90"
              >
                <Link href={`/student/orders/${order.id}`} className="block">
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#6200EE]/10 to-[#03DAC5]/10 border border-[#6200EE]/20 flex-shrink-0">
                      <Package className="w-5 h-5 text-[#6200EE]" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-[#0B0E11] text-lg group-hover:text-[#6200EE] transition-colors truncate">
                            {order.title}
                          </h3>
                          <p className="text-sm text-[#6B7280] mt-1">
                            {order.service_categories?.name || 'Service'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                          {order.urgency_level === 'urgent' && (
                            <span className={`px-2 py-1 rounded-lg border text-xs font-bold ${urgencyColorClass}`}>
                              URGENT
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-lg border text-xs font-bold ${statusColorClass}`}>
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {order.description && (
                        <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">
                          {order.description}
                        </p>
                      )}

                      {/* Location Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {order.pickup_location && (
                          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                            <MapPin className="w-4 h-4 text-[#6200EE] flex-shrink-0" />
                            <span className="truncate">From: {order.pickup_location}</span>
                          </div>
                        )}
                        {order.delivery_location && (
                          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                            <MapPin className="w-4 h-4 text-[#03DAC5] flex-shrink-0" />
                            <span className="truncate">To: {order.delivery_location}</span>
                          </div>
                        )}
                      </div>

                      {/* Runner Info */}
                      {order.runner_profile && (
                        <div className="flex items-center gap-2 mb-3 p-2 rounded-lg bg-[#6200EE]/5 border border-[#6200EE]/10">
                          <User className="w-4 h-4 text-[#6200EE]" />
                          <span className="text-sm font-semibold text-[#6200EE]">
                            Runner: {order.runner_profile.full_name}
                          </span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#E9E4FF]">
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-lg font-black text-[#6200EE]">
                              <DollarSign className="w-4 h-4" />
                              ₦{(order.final_amount || 0).toLocaleString()}
                            </div>
                            {order.platform_fee > 0 && (
                              <div className="text-xs text-[#6B7280]">
                                Fee: ₦{order.platform_fee.toLocaleString()}
                              </div>
                            )}
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#6200EE] transition-colors" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl"
          >
            {searchTerm || filter !== 'all' ? (
              <>
                <Search className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#0B0E11] mb-2">No matching orders</h3>
                <p className="text-[#6B7280] mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Clear Filters
                </button>
              </>
            ) : (
              <>
                <Package className="w-16 h-16 text-[#6B7280] mx-auto mb-4" />
                <h3 className="text-xl font-black text-[#0B0E11] mb-2">No orders yet</h3>
                <p className="text-[#6B7280] mb-6">
                  Create your first order to get started with our services
                </p>
                <Link href="/student/create-order">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-xl hover:shadow-lg transition-all">
                    Create Your First Order
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      {orders.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="mt-8 rounded-2xl border border-[#E9E4FF] bg-white/50 backdrop-blur-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-black text-[#0B0E11] mb-4">Order Statistics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
              <div className="text-2xl font-black text-amber-600">{counts.pending}</div>
              <div className="text-xs font-semibold text-amber-700">Pending</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
              <div className="text-2xl font-black text-blue-600">{counts.active}</div>
              <div className="text-xs font-semibold text-blue-700">Active</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
              <div className="text-2xl font-black text-green-600">{counts.completed}</div>
              <div className="text-xs font-semibold text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200">
              <div className="text-2xl font-black text-gray-600">{counts.all}</div>
              <div className="text-xs font-semibold text-gray-700">Total</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
