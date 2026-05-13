'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '@/context/DataContext';

export function WeeklySalesChart() {
  const { analytics: { weeklySalesData } } = useData();
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Weekly Sales</h2>
      <p className="text-neutral-500 text-sm mb-6">This week's daily totals</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={weeklySalesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
            labelStyle={{ color: '#a3a3a3' }}
            itemStyle={{ color: '#e5e5e5' }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Sales']}
          />
          <Bar dataKey="sales" fill="#7c3aed" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
