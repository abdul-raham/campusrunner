'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/supabase/client';
import { 
  Package, 
  CheckCircle2, 
  Star, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff,
  Plus,
  Zap,
  ShoppingCart,
  Shirt,
  UtensilsCrossed
} from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string;
  title: string;
  status: string;
  final_amount: number;
  created_at: string;
  service_categories: {
    name: string;
    icon_name: string;
  } | null;
  profiles: {
    full_name: string;
  } | null;
}

interface DashboardStats {
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
  avgRating: number;
}

import { PageLoader } from '@/components/PageLoader';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch recent orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          id,
          title,
          status,
          final_amount,
          created_at
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (ordersData) {
        // Transform data to match interface
        const transformedOrders = ordersData.map(order => ({
          ...order,
          service_categories: {
            name: 'General Service',
            icon_name: 'Package'
          },
          profiles: {
            full_name: 'Runner'
          }
        }));
        setRecentOrders(transformedOrders);
      }

      // Calculate stats
      const { data: allOrders } = await supabase
        .from('orders')
        .select('status, final_amount')
        .eq('student_id', user.id);

      if (allOrders) {
        const activeOrders = allOrders.filter(order => 
          ['pending', 'accepted', 'in_progress'].includes(order.status)
        ).length;
        
        const completedOrders = allOrders.filter(order => 
          order.status === 'completed'
        ).length;
        
        const totalSpent = allOrders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.final_amount || 0), 0);

        setStats({
          activeOrders,
          completedOrders,
          totalSpent,
          avgRating: 4.8 // Mock rating for now
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Zap': Zap,
      'ShoppingCart': ShoppingCart,
      'Shirt': Shirt,
      'UtensilsCrossed': UtensilsCrossed,
    };
    return iconMap[iconName] || Package;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const quickServices = [
    { name: 'Market Run', icon: ShoppingCart, color: 'from-blue-500 to-blue-600', href: '/student/create-order?service=market_run' },
    { name: 'Gas Refill', icon: Zap, color: 'from-green-500 to-green-600', href: '/student/create-order?service=gas_refill' },
    { name: 'Food Pickup', icon: UtensilsCrossed, color: 'from-orange-500 to-orange-600', href: '/student/create-order?service=food_pickup' },
    { name: 'Laundry', icon: Shirt, color: 'from-purple-500 to-purple-600', href: '/student/create-order?service=laundry_pickup' },
  ];

  if (loading) {
    return <PageLoader />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <p className="text-xs font-semibold text-[#6B7280] mb-1">Welcome back</p>
        <h1 className="text-2xl font-black text-[#0B0E11] sm:text-3xl md:text-4xl">
          {profile?.full_name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-[#6B7280] text-sm sm:text-base mt-1">Here's what's happening with your orders today</p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
        {/* Left Column - Wallet & Stats */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Wallet Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#6200EE] via-[#4F2EE8] to-[#03DAC5] p-5 sm:p-6 md:p-8 text-white shadow-2xl shadow-[#6200EE]/30"
          >
            {/* Animated Background Elements */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">Wallet Balance</p>
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black">
                      {showBalance ? `₦${(5000 - stats.totalSpent).toLocaleString()}` : '••••••'}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                    >
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">Total Spent</p>
                  <p className="text-lg sm:text-xl font-bold">₦{stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Card Details */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white/70 text-[10px] mb-1">STUDENT</p>
                  <p className="text-sm sm:text-base font-semibold truncate max-w-[150px]">{profile?.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-[10px] mb-1">UNIVERSITY</p>
                  <p className="text-sm sm:text-base font-semibold truncate max-w-[150px]">{profile?.university}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[
              { label: 'Active Orders', value: stats.activeOrders.toString(), icon: Package, color: 'from-blue-500 to-blue-600' },
              { label: 'Completed', value: stats.completedOrders.toString(), icon: CheckCircle2, color: 'from-green-500 to-green-600' },
              { label: 'Avg Rating', value: stats.avgRating.toString(), icon: Star, color: 'from-yellow-500 to-yellow-600' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="rounded-xl md:rounded-2xl border border-white/20 bg-white/50 backdrop-blur-xl p-3 md:p-4 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className={`inline-flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} text-white mb-2`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <p className="text-xl md:text-2xl font-black text-[#0B0E11] mb-0.5">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-[#6B7280]">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Services */}
          <motion.div variants={itemVariants} className="rounded-xl md:rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-4 md:p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-black text-[#0B0E11]">Quick Services</h3>
              <Link href="/student/create-order" className="text-[#6200EE] font-bold text-xs hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={service.href}
                      className="block p-3 rounded-lg md:rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-white to-[#F4ECFF] hover:shadow-md transition-all text-center"
                    >
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${service.color} text-white mb-2 mx-auto`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-[#0B0E11]">{service.name}</p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Recent Orders */}
        <div className="space-y-4 md:space-y-6">
          <motion.div
            variants={itemVariants}
            className="rounded-xl md:rounded-2xl border border-white/50 bg-white/50 backdrop-blur-xl p-4 md:p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm md:text-base font-black text-[#0B0E11]">Recent Orders</h3>
              <Link href="/student/orders" className="text-[#6200EE] font-bold text-xs hover:underline">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, idx) => {
                  const ServiceIcon = getServiceIcon(order.service_categories?.icon_name || 'Package');
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Link
                        href={`/student/orders/${order.id}`}
                        className="block rounded-lg md:rounded-xl border border-[#E9E4FF] bg-gradient-to-br from-white to-[#F4ECFF] p-3 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-[#6200EE]/10">
                              <ServiceIcon className="w-3.5 h-3.5 text-[#6200EE]" />
                            </div>
                            <div>
                              <p className="font-bold text-[#0B0E11] text-xs truncate max-w-[120px]">{order.title}</p>
                              <p className="text-[10px] text-[#6B7280] truncate max-w-[120px]">{order.profiles?.full_name || 'Unassigned'}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] text-[#6B7280]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                          <p className="font-bold text-[#6200EE] text-xs">₦{order.final_amount?.toLocaleString() || '0'}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center py-6">
                  <Package className="w-10 h-10 text-[#6B7280] mx-auto mb-2" />
                  <p className="text-[#6B7280] font-medium text-xs">No orders yet</p>
                  <Link
                    href="/student/create-order"
                    className="inline-flex items-center gap-2 mt-3 px-3 py-2 bg-[#6200EE] text-white rounded-lg text-xs font-bold hover:bg-[#4F2EE8] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create your first order
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - Promotional */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="rounded-xl md:rounded-2xl border border-white/50 bg-gradient-to-r from-[#6200EE]/10 via-[#03DAC5]/10 to-[#6200EE]/10 backdrop-blur-xl p-4 md:p-6 shadow-lg"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-[#0B0E11] mb-1">⭐ Welcome to CampusRunner!</h3>
            <p className="text-[#6B7280] text-xs sm:text-sm mb-3">Get your first order delivered with 10% off</p>
            <Link
              href="/student/create-order"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white font-bold rounded-lg text-xs hover:shadow-lg transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Order
            </Link>
          </div>
          <div className="text-3xl sm:text-5xl">🎉</div>
        </div>
      </motion.div>
    </motion.div>
  );
}