'use client';

import { useData } from '@/context/DataContext';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard, MetricsGrid } from '@/components/metrics/MetricCard';

const DEMO_KPIS = [
  { label: 'Total Customers', value: 1920, change: 88 },
  { label: 'New This Month',  value: 214,  change: 31 },
  { label: 'Avg. Order Value', value: 66.7, change: 2.1, prefix: '$', decimal: true },
  { label: 'Avg. Orders / Customer', value: 3.2, change: 0.2, decimal: true },
];

const DEMO_CUSTOMERS = [
  { name: 'Alex Johnson',  orders: 12, spent: 948.88,  firstDate: '2025-03-14' },
  { name: 'Maria Garcia',  orders: 8,  spent: 1239.92, firstDate: '2025-06-01' },
  { name: 'James Lee',     orders: 23, spent: 459.77,  firstDate: '2024-11-20' },
  { name: 'Sarah Kim',     orders: 5,  spent: 349.95,  firstDate: '2026-01-08' },
  { name: 'Tom Brown',     orders: 17, spent: 679.83,  firstDate: '2025-09-17' },
  { name: 'Emily Clark',   orders: 9,  spent: 719.91,  firstDate: '2025-07-22' },
];

export default function CustomersPage() {
  const { rows } = useData();

  const kpis = rows.length === 0 ? DEMO_KPIS : (() => {
    const custMap = new Map<string, { orders: number; spent: number; firstDate: string }>();
    rows.forEach(r => {
      const name = r.customer || 'Unknown';
      const cur = custMap.get(name) ?? { orders: 0, spent: 0, firstDate: r.date };
      custMap.set(name, {
        orders: cur.orders + 1,
        spent: cur.spent + r.amount,
        firstDate: r.date < cur.firstDate ? r.date : cur.firstDate,
      });
    });
    const total   = custMap.size;
    const avgOrders = total > 0 ? rows.length / total : 0;
    const avgAov    = rows.length > 0 ? rows.reduce((s, r) => s + r.amount, 0) / rows.length : 0;
    return [
      { label: 'Total Customers',        value: total,                                    change: 0 },
      { label: 'Unique Products Bought', value: new Set(rows.map(r => r.product).filter(Boolean)).size, change: 0 },
      { label: 'Avg. Order Value',       value: Math.round(avgAov * 100) / 100,           change: 0, prefix: '$', decimal: true },
      { label: 'Avg. Orders / Customer', value: Math.round(avgOrders * 10) / 10,          change: 0, decimal: true },
    ];
  })();

  const tableRows = rows.length === 0 ? DEMO_CUSTOMERS : (() => {
    const custMap = new Map<string, { orders: number; spent: number; firstDate: string }>();
    rows.forEach(r => {
      const name = r.customer || 'Unknown';
      const cur = custMap.get(name) ?? { orders: 0, spent: 0, firstDate: r.date };
      custMap.set(name, {
        orders: cur.orders + 1,
        spent: cur.spent + r.amount,
        firstDate: r.date < cur.firstDate ? r.date : cur.firstDate,
      });
    });
    return Array.from(custMap.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 50);
  })();

  return (
    <>
      <TopBar title="Customers" subtitle="Manage and understand your customer base" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <MetricsGrid>
          {kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}
        </MetricsGrid>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-1">All Customers</h2>
          <p className="text-neutral-500 text-sm mb-4">Sorted by total spend</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-800">
                  <th className="pb-3 text-neutral-500 font-medium">Name</th>
                  <th className="pb-3 text-neutral-500 font-medium text-right">Orders</th>
                  <th className="pb-3 text-neutral-500 font-medium text-right">Total Spent</th>
                  <th className="pb-3 text-neutral-500 font-medium text-right hidden md:table-cell">First Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {tableRows.map((c) => (
                  <tr key={c.name} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 text-white font-medium">{c.name}</td>
                    <td className="py-3 text-neutral-300 text-right">{c.orders}</td>
                    <td className="py-3 text-neutral-300 text-right">${c.spent.toFixed(2)}</td>
                    <td className="py-3 text-neutral-400 text-right hidden md:table-cell">{c.firstDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
