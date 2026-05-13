import { TopBar } from '@/components/layout/TopBar';

const sections = [
  {
    title: 'Business Profile',
    fields: [
      { label: 'Business Name', value: 'My Business', type: 'text' },
      { label: 'Industry', value: 'E-commerce', type: 'text' },
      { label: 'Currency', value: 'USD', type: 'text' },
      { label: 'Timezone', value: 'UTC-5 (Eastern)', type: 'text' },
    ],
  },
  {
    title: 'Notifications',
    fields: [
      { label: 'Email Reports', value: 'Weekly', type: 'text' },
      { label: 'Low Stock Alerts', value: 'Enabled', type: 'text' },
      { label: 'Order Notifications', value: 'Enabled', type: 'text' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Manage your account and preferences" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-4">{section.title}</h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0">
                  <label className="text-sm text-neutral-400">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="bg-neutral-800 border border-neutral-700 text-sm text-white rounded-md px-3 py-1.5 w-48 focus:outline-none focus:border-violet-500"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2 rounded-md transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
