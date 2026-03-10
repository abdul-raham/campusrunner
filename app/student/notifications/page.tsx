import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Notifications - CampusRunner',
};

export default function StudentNotificationsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <div className="divide-y">
          {[
            {
              title: 'Order Accepted',
              message: 'Runner Chukwu accepted your Market Run order',
              time: '2 mins ago',
              read: false,
            },
            {
              title: 'Order Completed',
              message: 'Your Food Pickup order has been completed',
              time: '1 hour ago',
              read: true,
            },
            {
              title: 'New Offer',
              message: '3 runners are offering to do your Printing job',
              time: '3 hours ago',
              read: true,
            },
          ].map((notif, idx) => (
            <div
              key={idx}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`font-semibold ${!notif.read ? 'text-primary' : 'text-gray-900'}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                </div>
                <p className="text-xs text-gray-500 ml-4">{notif.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
