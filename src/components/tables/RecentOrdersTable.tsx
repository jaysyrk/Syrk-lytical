'use client';

import { useData } from '@/context/DataContext';

const statusStyles: Record<string, string> = {
  completed: 'bg-emerald-500/15 text-emerald-400',
  processing: 'bg-blue-500/15 text-blue-400',
  shipped: 'bg-violet-500/15 text-violet-400',
  cancelled: 'bg-red-500/15 text-red-400',
};

export function RecentOrdersTable() {
  const { analytics: { recentOrders } } = useData();
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Recent Orders</h2>
      <p className="text-neutral-500 text-sm mb-4">Latest customer transactions</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-800">
              <th className="pb-3 text-neutral-500 font-medium">Order</th>
              <th className="pb-3 text-neutral-500 font-medium">Customer</th>
              <th className="pb-3 text-neutral-500 font-medium hidden md:table-cell">Product</th>
              <th className="pb-3 text-neutral-500 font-medium text-right">Amount</th>
              <th className="pb-3 text-neutral-500 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {recentOrders.map((o) => (
              <tr key={o.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 text-neutral-400 font-mono text-xs">{o.id}</td>
                <td className="py-3 text-white">{o.customer}</td>
                <td className="py-3 text-neutral-400 hidden md:table-cell">{o.product}</td>
                <td className="py-3 text-neutral-300 text-right">${o.amount.toFixed(2)}</td>
                <td className="py-3 text-right">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[o.status]}`}>
                    {o.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
