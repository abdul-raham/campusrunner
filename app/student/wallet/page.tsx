import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Wallet - CampusRunner',
};

export default function StudentWalletPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
      </div>

      {/* Wallet Balance */}
      <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-white">
        <p className="text-sm opacity-80">Available Balance</p>
        <p className="text-5xl font-bold mt-2">₦5,000.00</p>
        <div className="flex gap-3 mt-6">
          <button className="px-6 py-2 bg-white text-primary rounded-lg font-semibold hover:opacity-90">
            Add Money
          </button>
          <button className="px-6 py-2 border-2 border-white text-white rounded-lg font-semibold hover:opacity-90">
            Withdraw
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Transaction History</h2>
        </div>
        <div className="divide-y">
          {[
            {
              id: 1,
              type: 'credit',
              desc: 'Refund - Order #ORD-001',
              amount: '+₦500',
            },
            {
              id: 2,
              type: 'debit',
              desc: 'Payment - Order #ORD-002',
              amount: '-₦750',
            },
            {
              id: 3,
              type: 'credit',
              desc: 'Promotion Bonus',
              amount: '+₦1,000',
            },
          ].map((tx) => (
            <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{tx.desc}</p>
                <p className="text-sm text-gray-600">Today at 2:30 PM</p>
              </div>
              <p className={`font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                {tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
