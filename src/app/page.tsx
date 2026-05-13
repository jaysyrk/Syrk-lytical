'use client';

import { useData } from '@/context/DataContext';
import { TopBar } from '@/components/layout/TopBar';
import { MetricCard, MetricsGrid } from '@/components/metrics/MetricCard';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { SalesByCategoryChart } from '@/components/charts/SalesByCategoryChart';
import { WeeklySalesChart } from '@/components/charts/WeeklySalesChart';
import { TopProductsTable } from '@/components/tables/TopProductsTable';
import { RecentOrdersTable } from '@/components/tables/RecentOrdersTable';

export default function DashboardPage() {
  const { analytics } = useData();
  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back, Jake" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <MetricsGrid>
          {analytics.kpis.map((kpi) => (
            <MetricCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              change={kpi.change}
              prefix={kpi.prefix}
              decimal={kpi.decimal}
            />
          ))}
        </MetricsGrid>

        {/* Revenue Chart */}
        <RevenueChart />

        {/* Weekly + Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklySalesChart />
          <SalesByCategoryChart />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopProductsTable />
          <RecentOrdersTable />
        </div>
      </div>
    </>
  );
}
