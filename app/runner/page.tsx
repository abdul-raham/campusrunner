'use client';

import { useState } from 'react';
import { Bell, Search, MapPin, Clock, Star, Package, CreditCard, TrendingUp, Users } from 'lucide-react';

export default function RunnerDashboard() {
  const availableJobs = [
    { id: 1, service: 'Market Run', location: 'Hostel 5', payment: '₦800', time: '30 mins', distance: '0.5km' },
    { id: 2, service: 'Gas Refill', location: 'Block A', payment: '₦500', time: '15 mins', distance: '0.3km' },
    { id: 3, service: 'Food Pickup', location: 'Cafeteria', payment: '₦600', time: '20 mins', distance: '0.8km' },
  ];

  const recentJobs = [
    { id: 1, service: 'Market Run', client: 'Sarah M.', status: 'Completed', payment: '₦800', rating: 5 },
    { id: 2, service: 'Gas Refill', client: 'John D.', status: 'Completed', payment: '₦500', rating: 4 },
    { id: 3, service: 'Laundry', client: 'Mike K.', status: 'Completed', payment: '₦700', rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Runner Dashboard</h1>
            <p className="text-gray-600 text-sm">Ready to earn today?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6200EE] focus:border-transparent w-64"
              />
            </div>
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-[#6200EE] rounded-full flex items-center justify-center text-white font-semibold text-sm">
              R
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Available Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 font-medium">+3 new</span>
              <span className="text-gray-500 ml-1">in last hour</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">45</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 font-medium">+5</span>
              <span className="text-gray-500 ml-1">this week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">₦25,000</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <span className="text-green-600 font-medium">+₦2,500</span>
              <span className="text-gray-500 ml-1">this week</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Rating</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">4.9</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Jobs</h3>
              <button className="text-[#6200EE] font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="border border-gray-100 rounded-xl p-4 hover:border-[#6200EE] hover:bg-[#6200EE]/5 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{job.service}</h4>
                    <span className="text-lg font-bold text-[#6200EE]">{job.payment}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.time}</span>
                    </div>
                    <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">{job.distance}</span>
                  </div>
                  <button className="w-full mt-3 bg-[#6200EE] text-white py-2 rounded-lg hover:bg-[#4F2EE8] transition-colors font-medium">
                    Accept Job
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Completed Jobs</h3>
              <button className="text-[#6200EE] font-medium hover:underline">View all</button>
            </div>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{job.service}</p>
                      <p className="text-sm text-gray-600">Client: {job.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{job.payment}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(job.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}