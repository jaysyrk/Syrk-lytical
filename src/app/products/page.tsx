'use client';

import { useData } from '@/context/DataContext';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard, MetricsGrid } from '@/components/metrics/MetricCard';
import { TopProductsTable } from '@/components/tables/TopProductsTable';
import { SalesByCategoryChart } from '@/components/charts/SalesByCategoryChart';

export default function ProductsPage() {
  const { rows } = useData();

  const kpis = rows.length === 0 ? [
    { label: 'Total Products',  value: 248, change: 12 },
    { label: 'Active Listings', value: 231, change: 8 },
    { label: 'Low Stock',       value: 14,  change: -3 },
    { label: 'Out of Stock',    value: 3,   change: 1 },
  ] : (() => {
    const products  = new Set(rows.map(r => r.product).filter(Boolean));
    const categories = new Set(rows.map(r => r.category).filter(Boolean));
    const totalRev  = rows.reduce((s, r) => s + r.amount, 0);
    const avgPrice  = rows.length > 0 ? totalRev / rows.length : 0;
    return [
      { label: 'Unique Products',  value: products.size,                         change: 0 },
      { label: 'Categories',       value: categories.size,                       change: 0 },
      { label: 'Total Revenue',    value: Math.round(totalRev * 100) / 100,      change: 0, prefix: '$' },
      { label: 'Avg. Sale Price',  value: Math.round(avgPrice * 100) / 100,      change: 0, prefix: '$', decimal: true },
    ];
  })();

  return (
    <>
      <TopBar title="Products" subtitle="Manage your product catalog" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <MetricsGrid>
          {kpis.map((kpi) => <MetricCard key={kpi.label} {...kpi} />)}
        </MetricsGrid>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopProductsTable />
          <SalesByCategoryChart />
        </div>
      </div>
    </>
  );
}
