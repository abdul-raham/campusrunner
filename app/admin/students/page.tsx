import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Students - CampusRunner',
};

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">892</p>
          <p className="text-gray-600">Total Students</p>
        </div>
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">645</p>
          <p className="text-gray-600">Active This Month</p>
        </div>
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">₦2.5M</p>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">Name</th>
                <th className="text-left px-6 py-4 font-semibold">Email</th>
                <th className="text-left px-6 py-4 font-semibold">University</th>
                <th className="text-left px-6 py-4 font-semibold">Orders</th>
                <th className="text-left px-6 py-4 font-semibold">Joined</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">Student {i}</td>
                  <td className="px-6 py-4">student{i}@example.com</td>
                  <td className="px-6 py-4">University of Lagos</td>
                  <td className="px-6 py-4">{12 - i}</td>
                  <td className="px-6 py-4">2026-0{2 + i}-0{5 + i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
