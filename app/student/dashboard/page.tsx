'use client';

import { useState } from 'react';
import { 
  Bell, 
  Search, 
  Plus, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Star,
  Wallet,
  TrendingUp,
  Package,
  ShoppingCart,
  Printer,
  Car,
  Coffee
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const quickActions = [
    { icon: ShoppingCart, label: 'Market Run', color: 'bg-blue-50 text-blue-600' },
    { icon: Printer, label: 'Printing', color: 'bg-green-50 text-green-600' },
    { icon: Coffee, label: 'Food Pickup', color: 'bg-orange-50 text-orange-600' },
    { icon: Package, label: 'Delivery', color: 'bg-purple-50 text-purple-600' },
  ];

  const recentOrders = [
    { id: '001', service: 'Market Run', status: 'In Progress', time: '15 mins ago', amount: '₦2,500' },
    { id: '002', service: 'Printing', status: 'Completed', time: '2 hours ago', amount: '₦800' },
    { id: '003', service: 'Food Pickup', status: 'Delivered', time: '1 day ago', amount: '₦1,200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Good morning, John</h1>
            <p className="text-sm text-gray-500">University of Lagos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600" />
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">J</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">Wallet Balance</p>
              <h2 className="text-2xl font-bold">₦15,750.00</h2>
            </div>
            <Wallet className="h-8 w-8 text-blue-200" />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium">
              Add Money
            </button>
            <button className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 text-sm font-medium">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-gray-900">{action.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-8">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Orders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-xs text-green-600">+12% this week</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Rating</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-xs text-gray-500">Based on 15 reviews</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-blue-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.service}</p>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {order.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Campus Area
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Order Button */}
      <div className="fixed bottom-6 right-4">
        <button className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {[
            { id: 'home', label: 'Home', active: true },
            { id: 'orders', label: 'Orders', active: false },
            { id: 'wallet', label: 'Wallet', active: false },
            { id: 'profile', label: 'Profile', active: false },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                activeTab === tab.id ? 'text-blue-600 bg-blue-50' : 'text-gray-500'
              }`}
            >
              <div className="w-6 h-6 mb-1"></div>
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}