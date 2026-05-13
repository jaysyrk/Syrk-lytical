'use client';

import { useData } from '@/context/DataContext';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard, MetricsGrid } from '@/components/metrics/MetricCard';
import { WeeklySalesChart } from '@/components/charts/WeeklySalesChart';
import { RecentOrdersTable } from '@/components/tables/RecentOrdersTable';

export default function SalesPage() {
  const { rows, analytics } = useData();

  const kpis = (() => {
    if (rows.length === 0) return [
      { label: 'Gross Revenue', value: 128450, change: 12400, prefix: '$' },
      { label: 'Net Revenue',   value: 94230,  change: 8700,  prefix: '$' },
      { label: 'Total Orders',  value: 3842,   change: 312 },
      { label: 'Refunds',       value: 148,    change: -22 },
    ];
    const grossRev = rows.reduce((s, r) => s + r.amount, 0);
    const netRev   = rows.reduce((s, r) => s + r.amount - r.cost, 0);
    const refunds  = rows.filter(r => /refund/i.test(r.status)).length;
    // MoM change comes from analytics kpis[0] (revenue) and kpis[1] (orders)
    const revChange   = analytics.kpis[0]?.change ?? 0;
    const orderChange = analytics.kpis[1]?.change ?? 0;
    return [
      { label: 'Gross Revenue', value: Math.round(grossRev * 100) / 100, change: revChange, prefix: '$' },
      { label: 'Net Revenue',   value: Math.round(netRev * 100) / 100,   change: Math.round((netRev / grossRev) * revChange * 100) / 100, prefix: '$' },
      { label: 'Total Orders',  value: rows.length, change: orderChange },
      { label: 'Refunds',       value: refunds,     change: 0 },
    ];
  })();

  return (
    <>
      <TopBar title="Sales" subtitle="Track revenue and order performance" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <MetricsGrid>
          {kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}
        </MetricsGrid>
        <WeeklySalesChart />
        <RecentOrdersTable />
      </div>
    </>
  );
}
