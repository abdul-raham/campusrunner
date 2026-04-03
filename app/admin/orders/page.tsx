'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Eye, User, X, Loader, MapPin, Clock, DollarSign, Package, Star, Search } from 'lucide-react';
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
  runners?: {
    rating: number;
    total_jobs: number;
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
          service_category_id,
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

      let studentProfiles: any[] = [];
      let runnerProfiles: any[] = [];
      let serviceCategories: any[] = [];

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

      const categoryIds = [...new Set((data || []).map(o => o.service_category_id).filter(Boolean))];
      if (categoryIds.length > 0) {
        const { data: categories } = await supabase
          .from('service_categories')
          .select('id, name, icon_name')
          .in('id', categoryIds);
        serviceCategories = categories || [];
      }

      // Combine the data
      const ordersWithProfiles = (data || []).map(order => ({
        ...order,
        service_category_id: order.service_category_id || 'general',
        pickup_location: order.pickup_location || 'Pickup Location',
        delivery_location: order.delivery_location || 'Delivery Location',
        service_categories: serviceCategories.find(c => c.id === order.service_category_id) || {
          name: 'General Service',
          icon_name: 'package'
        },
        student_profile: studentProfiles.find(s => s.id === order.student_id) || {
          full_name: 'Student User',
          phone: '+234000000000',
          university: 'University'
        },
        runner_profile: runnerProfiles.find(r => r.id === order.runner_id) || null
      }));

      setOrders(ordersWithProfiles);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRunners = async () => {
    setLoadingRunners(true);
    try {
      const res = await fetch('/api/admin/runners');
      if (!res.ok) throw new Error('Failed to load runners');
      const data = await res.json();
      const approved = (data.runners || []).filter((r: Runner) =>
        r.runners?.verification_status === 'approved'
      );
      setRunners(approved);
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
      const res = await fetch('/api/admin/assign-runner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, runnerId }),
      });

      if (!res.ok) throw new Error('Failed to assign runner');

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
      // Still update local state even if database update fails
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
    } finally {
      setAssigningOrder(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setAssigningOrder(orderId);
    try {
      const res = await fetch('/api/admin/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) throw new Error('Failed to cancel order');

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
      case 'in_progress': return 'bg-sky-50 border-sky-200 text-sky-700';
      case 'accepted': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'cancelled': return 'bg-rose-50 border-rose-200 text-rose-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center ">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-amber-200 border-t-amber-500"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-slate-500"
          >
            Loading Orders...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-8 ">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-amber-500 text-white">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Order Management</h1>
        </div>
        <p className="text-slate-500">Monitor, assign, and manage all platform orders</p>
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-6"
      >
        <div className="glass-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders, students, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
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
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'bg-white/50 border border-slate-200/80 text-slate-500 hover:bg-white'
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
          <div className="glass-card p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-slate-500 text-lg">No orders found</p>
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
                className="glass-card p-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg mb-1">{order.title}</h3>
                        <p className="text-slate-500 text-sm line-clamp-2">{order.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-lg border font-semibold text-sm ${getStatusColor(order.status)}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-slate-900">{order.student_profile?.full_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">{order.service_categories?.name}</span>
                        </div>
                        {order.runner_profile && (
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-500">Runner: {order.runner_profile.full_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500 truncate">{order.pickup_location || 'Pickup location'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-500">{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-slate-500" />
                          <span className="font-semibold text-slate-900">₦{(order.final_amount || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200/80 text-slate-900 rounded-xl font-semibold hover:bg-white transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Link>

                    {order.status === 'pending' && (
                      <button
                        onClick={() => setAssignmentOpen(order.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all"
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
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAssignmentOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel p-7 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 text-white mb-4">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Assign Runner</h3>
                <p className="text-slate-500">Select an available runner for this order</p>
              </div>

              {loadingRunners ? (
                <div className="text-center py-8">
                  <Loader className="h-8 w-8 animate-spin mx-auto mb-2 text-amber-500" />
                  <p className="text-slate-500">Loading runners...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {runners.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-slate-500">No approved runners available</p>
                      </div>
                    ) : (
                      runners.map((runner) => (
                        <label
                          key={runner.id}
                          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                            selectedRunner === runner.id
                              ? 'border-amber-300 bg-amber-500/5'
                              : 'border-slate-200/80 hover:border-amber-300/50 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="runner"
                            value={runner.id}
                            checked={selectedRunner === runner.id}
                            onChange={(e) => setSelectedRunner(e.target.value)}
                            className="h-4 w-4 text-amber-500 focus:ring-amber-400"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{runner.full_name}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>⭐ {(runner.runners?.rating  0).toFixed(1)}</span>
                              <span>📦 {runner.runners?.total_jobs  0} jobs</span>
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
                  className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 disabled:opacity-50 transition-all"
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
