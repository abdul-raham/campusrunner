import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Runners - CampusRunner Admin',
};

export default function AdminRunnersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Runners</h1>
        <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select className="px-4 py-2 border rounded-lg">
          <option>All Status</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      {/* Runners Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Name</th>
                <th className="text-left px-6 py-4 font-semibold">Email</th>
                <th className="text-left px-6 py-4 font-semibold">Status</th>
                <th className="text-left px-6 py-4 font-semibold">Rating</th>
                <th className="text-left px-6 py-4 font-semibold">Jobs</th>
                <th className="text-left px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Runner {i}</td>
                  <td className="px-6 py-4">runner{i}@example.com</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        i === 1
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {i === 1 ? 'Pending' : 'Approved'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{4.8 - i * 0.1}★</td>
                  <td className="px-6 py-4">{50 - i * 5}</td>
                  <td className="px-6 py-4">
                    {i === 1 && (
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                          Approve
                        </button>
                        <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                          Reject
                        </button>
                      </div>
                    )}
                    {i !== 1 && (
                      <a href="#" className="text-primary font-semibold">
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
