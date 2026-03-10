import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Settings - CampusRunner',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings Cards */}
      <div className="space-y-4">
        {[
          {
            title: 'Platform Fees',
            desc: 'Manage commission structure',
          },
          {
            title: 'Service Categories',
            desc: 'Add, edit, or disable services',
          },
          {
            title: 'Verification Rules',
            desc: 'Runner verification requirements',
          },
          {
            title: 'Payment Settings',
            desc: 'Payment methods and thresholds',
          },
        ].map((setting, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 border flex justify-between items-center hover:border-primary transition-all"
          >
            <div>
              <h3 className="font-bold text-gray-900">{setting.title}</h3>
              <p className="text-sm text-gray-600">{setting.desc}</p>
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold">
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
