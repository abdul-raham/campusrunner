'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/supabase/client';
import { Eye, User, X, Loader, MapPin, Clock, DollarSign, Package, Star, Filter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Order {
  id: string;
  title: string;
  description: string;
  status: string;
  final_amount: number;
  platform_fee: number;
  runner_payout: number;
  created_at: string;
  student_id: string;
  runner_id: string | null;
  service_category_id: string;
  pickup_location: string;
  delivery_location: string;
  service_categories: {
    name: string;
    icon_name: string;
  } | null;
  student_profile: {
    full_name: string;
    phone: string;
    university: string;
  } | null;
  runner_profile: {
    full_name: string;
    phone: string;
  } | null;
}

interface Runner {
  id: string;
  full_name: string;
  phone: string;
  university: string;
  runners: {
    rating: number;
    jobs_completed: number;
    verification_status: string;
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [runners, setRunners] = useState<Runner[]>([]);
  const [assigningOrder, setAssigningOrder] = useState<string | null>(null);
  const [selectedRunner, setSelectedRunner] = useState<string>('');
  const [assignmentOpen, setAssignmentOpen] = useState<string | null>(null);
  const [loadingRunners, setLoadingRunners] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchRunners();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, searchTerm, orders]);

  const fetchOrders = async () => {
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
          student_id,
          runner_id,
          pickup_location,
          delivery_location
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Orders Supabase error:', error);
        throw error;
      }

      // Get profiles separately to avoid join issues
      const studentIds = [...new Set(data?.map(o => o.student_id).filter(Boolean))];
      const runnerIds = [...new Set(data?.map(o => o.runner_id).filter(Boolean))];

      let studentProfiles = [];
      let runnerProfiles = [];

      if (studentIds.length > 0) {
        const { data: students } = await supabase
          .from('profiles')
          .select('id, full_name, phone, university')
          .in('id', studentIds);
        studentProfiles = students || [];
      }

      if (runnerIds.length > 0) {
        const { data: runners } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', runnerIds);
        runnerProfiles = runners || [];
      }

      // Combine the data
      const ordersWithProfiles = (data || []).map(order => ({
        ...order,
        service_categories: {
          name: 'General Service',
          icon_name: 'package'
        },
        student_profile: studentProfiles.find(s => s.id === order.student_id) || null,
        runner_profile: runnerProfiles.find(r => r.id === order.runner_id) || null
      }));

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRunners = async () => {
    setLoadingRunners(true);
    try {
      // Simplified query for runners in orders page
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, 
          full_name,
          phone,
          university
        `)
        .eq('role', 'runner');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      // Add mock runner data for now
      const runnersWithMockData = (data || []).map(profile => ({
        ...profile,
        runners: {
          rating: 4.5,
          jobs_completed: 0,
          verification_status: 'approved'
        }
      }));

      setRunners(runnersWithMockData);
    } catch (error) {
      console.error('Error fetching runners:', error);
    } finally {
      setLoadingRunners(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(o => 
        o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.student_profile?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.service_categories?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleAssignRunner = async (orderId: string, runnerId: string) => {
    if (!runnerId) return;
    setAssigningOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ runner_id: runnerId, status: 'accepted' })
        .eq('id', orderId);

      if (error) throw error;

      // Update local state
      setOrders(orders.map(o => 
        o.id === orderId 
          ? { 
              ...o, 
              runner_id: runnerId, 
              status: 'accepted',
              runner_profile: runners.find(r => r.id === runnerId) ? {
                full_name: runners.find(r => r.id === runnerId)!.full_name,
                phone: runners.find(r => r.id === runnerId)!.phone
              } : null
            } 
          : o
      ));
      
      setAssignmentOpen(null);
      setSelectedRunner('');
    } catch (error) {
      console.error('Error assigning runner:', error);
    } finally {
      setAssigningOrder(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setAssigningOrder(orderId);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled' } : o
      ));
    } catch (error) {
      console.error('Error cancelling order:', error);
    } finally {
      setAssigningOrder(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'in_progress': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'accepted': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'cancelled': return 'bg-red-50 border-red-200 text-red-700';
      default: return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return '✅';
      case 'in_progress': return '🚀';
      case 'accepted': return '👍';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📦';
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
            Loading Orders...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#6200EE] text-white">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-[#0B0E11]">Order Management</h1>
        </div>
        <p className="text-[#6B7280]">Monitor, assign, and manage all platform orders</p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-6"
      >
        <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <input
                type="text"
                placeholder="Search orders, students, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E9E4FF] rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white shadow-lg'
                      : 'bg-white/50 border border-[#E9E4FF] text-[#6B7280] hover:bg-[#F4ECFF]'
                  }`}
                >
                  {status === 'in_progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="space-y-4"
      >
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-[#6B7280] text-lg">No orders found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                className="rounded-2xl border border-[#E9E4FF] bg-white/80 backdrop-blur-xl p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#0B0E11] text-lg mb-1">{order.title}</h3>
                        <p className="text-[#6B7280] text-sm line-clamp-2">{order.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getStatusIcon(order.status)}</span>
                        <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-[#6B7280]" />
                          <span className="font-semibold text-[#0B0E11]">{order.student_profile?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">{order.service_categories?.name}</span>
                        </div>
                        {order.runner_profile && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-[#6B7280]" />
                            <span className="text-[#6B7280]">Runner: {order.runner_profile.full_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280] truncate">{order.pickup_location || 'Pickup location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-[#6B7280]" />
                          <span className="text-[#6B7280]">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-[#6B7280]" />
                          <span className="font-semibold text-[#0B0E11]">₦{(order.final_amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#E9E4FF] text-[#0B0E11] rounded-xl font-semibold hover:bg-[#F4ECFF] transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => setAssignmentOpen(order.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-[#6200EE] text-white rounded-xl font-semibold hover:bg-[#4F2EE8] transition-all"
                      >
                        <User className="h-4 w-4" />
                        Assign Runner
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={assigningOrder !== null}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        {assigningOrder === order.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Assignment Modal */}
      <AnimatePresence>
        {assignmentOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAssignmentOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6200EE] text-white mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-[#0B0E11] mb-2">Assign Runner</h3>
                <p className="text-[#6B7280]">Select an available runner for this order</p>
              </div>

              {loadingRunners ? (
                <div className="text-center py-8">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-[#6200EE]" />
                  <p className="text-[#6B7280]">Loading runners...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {runners.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-[#6B7280]">No approved runners available</p>
                      </div>
                    ) : (
                      runners.map((runner) => (
                        <label
                          key={runner.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedRunner === runner.id
                              ? 'border-[#6200EE] bg-[#6200EE]/5'
                              : 'border-[#E9E4FF] hover:border-[#6200EE]/50 hover:bg-[#F4ECFF]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="runner"
                            value={runner.id}
                            checked={selectedRunner === runner.id}
                            onChange={(e) => setSelectedRunner(e.target.value)}
                            className="h-4 w-4 text-[#6200EE] focus:ring-[#6200EE]"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-[#0B0E11]">{runner.full_name}</p>
                            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                              <span>⭐ {runner.runners.rating.toFixed(1)}</span>
                              <span>📦 {runner.runners.jobs_completed} jobs</span>
                              <span>🎓 {runner.university}</span>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setAssignmentOpen(null)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAssignRunner(assignmentOpen, selectedRunner)}
                  disabled={!selectedRunner || assigningOrder !== null}
                  className="flex-1 px-4 py-3 bg-[#6200EE] text-white rounded-xl font-semibold hover:bg-[#4F2EE8] disabled:opacity-50 transition-all"
                >
                  {assigningOrder === assignmentOpen ? (
                    <Loader className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    'Assign Runner'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}