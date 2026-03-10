import { Metadata } from 'next';
import { MapPin, Clock, DollarSign, Filter, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Available Jobs - CampusRunner',
  description: 'Browse all available jobs near you',
};

const jobs = [
  {
    id: 1,
    service: 'Market Run',
    student: 'Chukwu O.',
    location: 'Hostel A, Block 2',
    budget: '₦750',
    time: '15 mins ago',
    distance: '0.3 km',
    urgency: 'normal',
    items: ['Rice', 'Beans', 'Oil'],
  },
  {
    id: 2,
    service: 'Gas Refill',
    student: 'Amara U.',
    location: 'Hostel C, Block 5',
    budget: '₦1,200',
    time: '32 mins ago',
    distance: '0.8 km',
    urgency: 'urgent',
    items: ['12.5kg Gas Cylinder'],
  },
  {
    id: 3,
    service: 'Food Delivery',
    student: 'Emeka C.',
    location: 'Main Campus',
    budget: '₦1,500',
    time: '45 mins ago',
    distance: '1.2 km',
    urgency: 'normal',
    items: ['Jollof Rice', 'Chicken', 'Juice'],
  },
  {
    id: 4,
    service: 'Pharmacy Run',
    student: 'Zainab A.',
    location: 'Medical Centre',
    budget: '₦2,000',
    time: '1 hour ago',
    distance: '2.1 km',
    urgency: 'urgent',
    items: ['Paracetamol', 'Cough Syrup'],
  },
  {
    id: 5,
    service: 'Printing & Photocopy',
    student: 'David O.',
    location: 'Library Block',
    budget: '₦500',
    time: '2 hours ago',
    distance: '0.5 km',
    urgency: 'normal',
    items: ['Printed & bound 50 pages'],
  },
  {
    id: 6,
    service: 'Laundry Pickup',
    student: 'Joy M.',
    location: 'Hostel F, Block 1',
    budget: '₦800',
    time: '3 hours ago',
    distance: '1.5 km',
    urgency: 'normal',
    items: ['5 bags of laundry'],
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-[#0B0E11] mb-2">
          Available Jobs
        </h1>
        <p className="text-[#6B7280] text-lg">
          {jobs.length} jobs waiting for you
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search by service, location..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#6200EE]/20 focus:border-[#6200EE]"
          />
        </div>
        <button className="px-6 py-3 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] font-semibold hover:bg-[#F6F7FB] transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="group rounded-[28px] border border-[#E9E4FF] bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:shadow-lg hover:border-[#6200EE]/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Service & Status */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-extrabold text-[#0B0E11]">
                    {job.service}
                  </h3>
                  {job.urgency === 'urgent' && (
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                      🔴 Urgent
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-[#00C853]/10 text-[#00C853] text-xs font-bold">
                    OPEN
                  </span>
                </div>

                {/* Student Info */}
                <p className="text-sm text-[#6B7280] font-semibold mb-3">
                  From <span className="text-[#0B0E11]">{job.student}</span>
                </p>

                {/* Items */}
                <div className="mb-4">
                  <p className="text-xs text-[#6B7280] font-semibold mb-2">Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-[#6200EE]/10 text-[#6200EE] text-xs font-bold"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location & Distance */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-[#6B7280] text-xs font-semibold mb-1">
                      Location
                    </p>
                    <p className="text-[#0B0E11] font-bold text-sm flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#6200EE]" />
                      {job.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] text-xs font-semibold mb-1">
                      Distance
                    </p>
                    <p className="text-[#0B0E11] font-bold text-sm">
                      {job.distance}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#6B7280] text-xs font-semibold mb-1">
                      Posted
                    </p>
                    <p className="text-[#0B0E11] font-bold text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#6200EE]" />
                      {job.time}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget & Action */}
              <div className="flex flex-col items-end gap-4 ml-6">
                <p className="text-3xl font-black text-[#6200EE]">
                  {job.budget}
                </p>
                <button className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white font-bold hover:shadow-lg transition-all duration-200 group-hover:scale-105 whitespace-nowrap">
                  Accept Job
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
