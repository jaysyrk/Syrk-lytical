'use client';

import { useData } from '@/context/DataContext';

export function TopProductsTable() {
  const { analytics: { topProducts } } = useData();
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Top Products</h2>
      <p className="text-neutral-500 text-sm mb-4">Best performing items</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-800">
              <th className="pb-3 text-neutral-500 font-medium">Product</th>
              <th className="pb-3 text-neutral-500 font-medium">Category</th>
              <th className="pb-3 text-neutral-500 font-medium text-right">Units</th>
              <th className="pb-3 text-neutral-500 font-medium text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {topProducts.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                <td className="py-3 text-white font-medium">{p.name}</td>
                <td className="py-3 text-neutral-400">{p.category}</td>
                <td className="py-3 text-neutral-300 text-right">{p.sales.toLocaleString()}</td>
                <td className="py-3 text-neutral-300 text-right">${p.revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
