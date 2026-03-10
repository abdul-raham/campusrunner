import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard - CampusRunner',
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Platform overview and management</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,245</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">892</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% this month</p>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <p className="text-sm text-gray-600">Total Runners</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">353</p>
          <p className="text-xs text-yellow-600 mt-2">48 pending verification</p>
        </div>

        <div className="bg-white rounded-xl p-6 border">
          <p className="text-sm text-gray-600">Platform Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">₦128,450</p>
          <p className="text-xs text-green-600 mt-2">↑ 25% this month</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Order #ORD-{1000 + i}</p>
                    <p className="text-sm text-gray-600">Market Run</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    In Progress
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-xl border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Pending Verifications</h2>
          </div>
          <div className="divide-y">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">Runner {i}</p>
                    <p className="text-sm text-gray-600">
                      ID: STU/2024/00{i}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                      Approve
                    </button>
                    <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-bold mb-4">Orders by Status</h2>
        <div className="grid md:grid-cols-6 gap-4">
          {[
            { status: 'Pending', count: 42, color: 'yellow' },
            { status: 'Accepted', count: 28, color: 'blue' },
            { status: 'In Progress', count: 19, color: 'purple' },
            { status: 'Completed', count: 156, color: 'green' },
            { status: 'Cancelled', count: 8, color: 'red' },
            { status: 'Disputed', count: 3, color: 'orange' },
          ].map((item) => (
            <div key={item.status} className="text-center">
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm text-gray-600">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
