import { TopBar } from '@/components/layout/TopBar';
import { CSVImporter } from '@/components/import/CSVImporter';

export default function ImportPage() {
  return (
    <>
      <TopBar title="Import Data" subtitle="Connect your business data to get live analytics" />
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '📊', title: 'Any CSV',   body: 'Shopify, Square, Stripe, Excel, Google Sheets — if it exports CSV, it works.' },
            { icon: '🔒', title: 'Private',   body: 'Your data stays in your browser. Nothing is uploaded or shared.' },
            { icon: '⚡', title: 'Instant',   body: 'Charts and KPIs update the moment you click Import.' },
          ].map(c => (
            <div key={c.title} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="text-white font-medium text-sm">{c.title}</p>
              <p className="text-neutral-500 text-sm mt-1">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Importer wizard */}
        <CSVImporter />
      </div>
    </>
  );
}
