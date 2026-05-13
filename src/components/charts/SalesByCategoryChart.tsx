'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '@/context/DataContext';

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f97316', '#a855f7'];

export function SalesByCategoryChart() {
  const { analytics: { salesByCategoryData } } = useData();
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h2 className="text-white font-semibold mb-1">Sales by Category</h2>
      <p className="text-neutral-500 text-sm mb-4">Revenue distribution</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={salesByCategoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {salesByCategoryData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
            labelStyle={{ color: '#a3a3a3' }}
            itemStyle={{ color: '#e5e5e5' }}
            formatter={(v) => [`${v}%`, undefined]}
          />
          <Legend wrapperStyle={{ color: '#a3a3a3', fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
