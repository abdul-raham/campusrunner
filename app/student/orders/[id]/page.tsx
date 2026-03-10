import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details - CampusRunner',
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Order {params.id}</h1>
      </div>

      {/* Order Info */}
      <div className="bg-white rounded-2xl border p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Service</p>
            <p className="font-bold text-lg">Market Run</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-bold text-lg">In Progress</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Runner</p>
            <p className="font-bold text-lg">Chukwu O.</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-bold text-lg">₦500</p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h2 className="text-xl font-bold mb-4">Order Timeline</h2>
        <div className="space-y-4">
          {[
            {
              status: 'Created',
              time: 'Today at 10:30 AM',
              completed: true,
            },
            {
              status: 'Accepted',
              time: 'Today at 10:45 AM',
              completed: true,
            },
            {
              status: 'In Progress',
              time: 'Today at 11:00 AM',
              completed: true,
            },
            {
              status: 'Completed',
              time: 'Pending...',
              completed: false,
            },
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full ${
                    item.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
                {idx < 3 && <div className="h-12 w-1 bg-gray-300 mt-2"></div>}
              </div>
              <div>
                <p className="font-semibold">{item.status}</p>
                <p className="text-sm text-gray-600">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
