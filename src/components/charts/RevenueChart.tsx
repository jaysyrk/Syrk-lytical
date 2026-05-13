'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '@/context/DataContext';
import type { DataRow } from '@/lib/dataTypes';

type Granularity = 'monthly' | 'weekly' | 'daily';

function getMondayKey(date: Date): string {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.toISOString().split('T')[0];
}

function toLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function computeWeekly(rows: DataRow[]) {
  const map = new Map<string, { revenue: number; cost: number }>();
  rows.forEach(r => {
    const key = getMondayKey(new Date(r.date));
    const cur = map.get(key) ?? { revenue: 0, cost: 0 };
    map.set(key, { revenue: cur.revenue + r.amount, cost: cur.cost + r.cost });
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-16)
    .map(([date, { revenue, cost }]) => ({
      label: toLabel(date),
      revenue: Math.round(revenue),
      expenses: Math.round(cost > 0 ? cost : revenue * 0.65),
    }));
}

function computeDaily(rows: DataRow[]) {
  const map = new Map<string, { revenue: number; cost: number }>();
  rows.forEach(r => {
    const cur = map.get(r.date) ?? { revenue: 0, cost: 0 };
    map.set(r.date, { revenue: cur.revenue + r.amount, cost: cur.cost + r.cost });
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-60)
    .map(([date, { revenue, cost }]) => ({
      label: toLabel(date),
      revenue: Math.round(revenue),
      expenses: Math.round(cost > 0 ? cost : revenue * 0.65),
    }));
}

const TABS: { key: Granularity; label: string }[] = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'weekly',  label: 'Weekly'  },
  { key: 'daily',   label: 'Daily'   },
];

const SUBTITLES: Record<Granularity, string> = {
  monthly: 'Monthly overview',
  weekly:  'Last 16 weeks',
  daily:   'Last 60 days',
};

export function RevenueChart() {
  const { rows, analytics: { revenueData } } = useData();
  const [granularity, setGranularity] = useState<Granularity>('monthly');

  const isDemo = rows.length === 0;

  const chartData = useMemo(() => {
    const monthly = revenueData.map(d => ({ label: d.month, revenue: d.revenue, expenses: d.expenses }));
    if (isDemo) return monthly; // no CSV loaded — always show mock monthly
    if (granularity === 'monthly') return monthly;
    if (granularity === 'weekly')  return computeWeekly(rows);
    return computeDaily(rows);
  }, [granularity, rows, revenueData, isDemo]);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-white font-semibold">Revenue vs Expenses</h2>
          <p className="text-neutral-500 text-sm mt-0.5">
            {isDemo && granularity !== 'monthly'
              ? 'Import a CSV to see weekly/daily data'
              : SUBTITLES[granularity]}
          </p>
        </div>
        <div className="flex gap-1 bg-neutral-800 rounded-lg p-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setGranularity(t.key)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                granularity === t.key
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
          <XAxis dataKey="label" tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#737373', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
            labelStyle={{ color: '#a3a3a3' }}
            itemStyle={{ color: '#e5e5e5' }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, undefined]}
          />
          <Legend wrapperStyle={{ color: '#a3a3a3', fontSize: '12px', paddingTop: '16px' }} />
          <Area type="monotone" dataKey="revenue"  stroke="#7c3aed" strokeWidth={2} fill="url(#colorRevenue)"  name="Revenue"  />
          <Area type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} fill="url(#colorExpenses)" name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
