import { Metadata } from 'next';
import { Briefcase, TrendingUp, Star, Wallet, AlertCircle, Clock, MapPin, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Runner Dashboard - CampusRunner',
  description: 'Manage your runner jobs and earnings',
};

const stats = [
  {
    label: 'Today\'s Earnings',
    value: '₦2,450',
    subtext: '3 completed jobs',
    icon: DollarSign,
    color: 'from-[#00C853]/20 to-[#00C853]/5',
    textColor: '#00C853',
  },
  {
    label: 'Rating',
    value: '4.9',
    subtext: '45 reviews',
    icon: Star,
    color: 'from-[#FFC107]/20 to-[#FFC107]/5',
    textColor: '#FFC107',
  },
  {
    label: 'Completed',
    value: '127',
    subtext: 'Total jobs',
    icon: Briefcase,
    color: 'from-[#6200EE]/20 to-[#6200EE]/5',
    textColor: '#6200EE',
  },
  {
    label: 'Pending Payout',
    value: '₦5,200',
    subtext: 'Ready to withdraw',
    icon: Wallet,
    color: 'from-[#03DAC5]/20 to-[#03DAC5]/5',
    textColor: '#03DAC5',
  },
];

const availableJobs = [
  {
    id: 1,
    service: 'Market Run',
    student: 'Chukwu O.',
    location: 'Hostel A, Block 2',
    budget: '₦750',
    time: '15 mins ago',
    distance: '0.3 km',
    urgency: 'normal',
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
  },
];

export default function RunnerDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-4xl font-black text-[#0B0E11] mb-2">
          Ready to Earn? 🚀
        </h1>
        <p className="text-[#6B7280] text-lg">
          Check available jobs and start making money
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group rounded-[28px] border border-[#E9E4FF] bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:shadow-lg hover:border-[#6200EE]/50"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.textColor }} />
                </div>
                <span className="text-xs font-bold text-[#6B7280] bg-[#F6F7FB] px-3 py-1 rounded-full">
                  {stat.label}
                </span>
              </div>
              <p className="text-3xl font-black text-[#0B0E11] mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-[#6B7280]">{stat.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="rounded-[28px] border border-[#E9E4FF] bg-gradient-to-br from-[#6200EE]/10 to-[#4F2EE8]/5 p-6 text-left hover:shadow-lg transition-all duration-300 group">
          <Briefcase className="w-6 h-6 text-[#6200EE] mb-2 group-hover:scale-110 transition" />
          <h3 className="font-extrabold text-[#0B0E11] mb-1">Browse Jobs</h3>
          <p className="text-sm text-[#6B7280]">12 new jobs available</p>
        </button>

        <button className="rounded-[28px] border border-[#E9E4FF] bg-gradient-to-br from-[#03DAC5]/10 to-[#03DAC5]/5 p-6 text-left hover:shadow-lg transition-all duration-300 group">
          <TrendingUp className="w-6 h-6 text-[#03DAC5] mb-2 group-hover:scale-110 transition" />
          <h3 className="font-extrabold text-[#0B0E11] mb-1">View Earnings</h3>
          <p className="text-sm text-[#6B7280]">Detailed analytics</p>
        </button>

        <button className="rounded-[28px] border border-[#E9E4FF] bg-gradient-to-br from-[#FFC107]/10 to-[#FFC107]/5 p-6 text-left hover:shadow-lg transition-all duration-300 group">
          <AlertCircle className="w-6 h-6 text-[#FFC107] mb-2 group-hover:scale-110 transition" />
          <h3 className="font-extrabold text-[#0B0E11] mb-1">Withdrawal</h3>
          <p className="text-sm text-[#6B7280]">Pending ₦5,200</p>
        </button>
      </div>

      {/* Available Jobs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#0B0E11]">
            Available Jobs Near You
          </h2>
          <a
            href="/runner/jobs"
            className="text-[#6200EE] font-bold text-sm hover:underline"
          >
            View All →
          </a>
        </div>

        <div className="space-y-3">
          {availableJobs.map((job) => (
            <div
              key={job.id}
              className="group rounded-[28px] border border-[#E9E4FF] bg-white/70 p-5 backdrop-blur transition-all duration-300 hover:shadow-lg hover:border-[#6200EE]/50"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-extrabold text-[#0B0E11]">
                      {job.service}
                    </h3>
                    {job.urgency === 'urgent' && (
                      <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="text-sm">
                      <p className="text-[#6B7280] font-semibold mb-1">From</p>
                      <p className="text-[#0B0E11] font-bold">{job.student}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-[#6B7280] font-semibold mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> Location
                      </p>
                      <p className="text-[#0B0E11] font-bold">{job.location}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-[#6B7280] font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Posted
                      </p>
                      <p className="text-[#0B0E11] font-bold">{job.time}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-[#6B7280] font-semibold mb-1">Distance</p>
                      <p className="text-[#0B0E11] font-bold">{job.distance}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <p className="text-2xl font-black text-[#6200EE]">
                    {job.budget}
                  </p>
                  <button className="px-6 py-2 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white font-bold text-sm hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                    Accept Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
