import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Orders - CampusRunner Admin',
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Order ID</th>
                <th className="text-left px-6 py-4 font-semibold">Student</th>
                <th className="text-left px-6 py-4 font-semibold">Runner</th>
                <th className="text-left px-6 py-4 font-semibold">Service</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-primary">
                    #ORD-{1000 + i}
                  </td>
                  <td className="px-6 py-4">Student {i}</td>
                  <td className="px-6 py-4">Runner {i}</td>
                  <td className="px-6 py-4">Market Run</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      Completed
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold">₦500</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
