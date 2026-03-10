import { Metadata } from 'next';
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Earnings - CampusRunner',
  description: 'View your earnings and transaction history',
};

const earnings = [
  {
    period: 'Today',
    amount: '₦2,450',
    jobs: 3,
    percentage: '+12%',
  },
  {
    period: 'This Week',
    amount: '₦14,800',
    jobs: 18,
    percentage: '+8%',
  },
  {
    period: 'This Month',
    amount: '₦58,200',
    jobs: 72,
    percentage: '+15%',
  },
  {
    period: 'Total Earnings',
    amount: '₦125,450',
    jobs: 247,
    percentage: 'All-time',
  },
];

const transactions = [
  {
    id: 1,
    service: 'Market Run',
    student: 'Chukwu O.',
    amount: '₦750',
    date: 'Today 2:30 PM',
    status: 'completed',
  },
  {
    id: 2,
    service: 'Food Delivery',
    student: 'Amara U.',
    amount: '₦1,200',
    date: 'Today 1:15 PM',
    status: 'completed',
  },
  {
    id: 3,
    service: 'Gas Refill',
    student: 'Emeka C.',
    amount: '₦500',
    date: 'Today 12:45 PM',
    status: 'completed',
  },
  {
    id: 4,
    service: 'Laundry Pickup',
    student: 'Joy M.',
    amount: '₦800',
    date: 'Yesterday 6:20 PM',
    status: 'completed',
  },
  {
    id: 5,
    service: 'Printing & Photocopy',
    student: 'David O.',
    amount: '₦600',
    date: 'Yesterday 3:10 PM',
    status: 'completed',
  },
];

export default function EarningsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-[#0B0E11] mb-2">
          Your Earnings
        </h1>
        <p className="text-[#6B7280] text-lg">
          Track your income and withdrawals
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {earnings.map((stat) => (
          <div
            key={stat.period}
            className="group rounded-[28px] border border-[#E9E4FF] bg-white/70 p-6 backdrop-blur transition-all duration-300 hover:shadow-lg hover:border-[#6200EE]/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6200EE]/20 to-[#6200EE]/5">
                <DollarSign className="w-5 h-5 text-[#6200EE]" />
              </div>
              {stat.percentage && (
                <span className="flex items-center gap-1 text-xs font-bold text-[#00C853]">
                  <ArrowUpRight className="w-4 h-4" />
                  {stat.percentage}
                </span>
              )}
            </div>
            <p className="text-[#6B7280] text-sm font-semibold mb-1">
              {stat.period}
            </p>
            <p className="text-3xl font-black text-[#0B0E11] mb-2">
              {stat.amount}
            </p>
            <p className="text-xs text-[#6B7280]">{stat.jobs} jobs</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <button className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#4F2EE8] text-white font-bold hover:shadow-lg transition-all">
          Withdraw Earnings
        </button>
        <button className="flex-1 px-6 py-4 rounded-2xl border border-[#E9E4FF] bg-white/70 backdrop-blur text-[#0B0E11] font-bold hover:shadow-lg transition-all">
          View Breakdown
        </button>
      </div>

      {/* Transactions */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#0B0E11]">
            Recent Transactions
          </h2>
          <a
            href="#"
            className="text-[#6200EE] font-bold text-sm hover:underline"
          >
            View All →
          </a>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-[28px] border border-[#E9E4FF] bg-white/70 p-5 backdrop-blur transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-[#0B0E11] mb-1">
                    {transaction.service}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    From {transaction.student}
                  </p>
                  <p className="text-xs text-[#6B7280] flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {transaction.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-[#00C853] mb-2">
                    +{transaction.amount}
                  </p>
                  <span className="px-3 py-1 rounded-full bg-[#00C853]/10 text-[#00C853] text-xs font-bold">
                    Completed
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
