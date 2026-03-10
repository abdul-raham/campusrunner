import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Student Profile - CampusRunner',
};

export default function StudentProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border p-8">
        <div className="flex items-start justify-between mb-6 pb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
              J
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">John Doe</h2>
              <p className="text-gray-600">Student • University of Lagos</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90">
            Edit Profile
          </button>
        </div>

        {/* Profile Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900">john@example.com</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-semibold text-gray-900">+234 80 0000 0000</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">University</p>
            <p className="font-semibold text-gray-900">University of Lagos</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hostel / Location</p>
            <p className="font-semibold text-gray-900">Hostel A, Block 2</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">12</p>
          <p className="text-gray-600">Orders Completed</p>
        </div>
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">4.8★</p>
          <p className="text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white rounded-xl p-6 border text-center">
          <p className="text-3xl font-bold text-primary">₦8,450</p>
          <p className="text-gray-600">Total Spent</p>
        </div>
      </div>
    </div>
  );
}
