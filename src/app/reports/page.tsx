import { TopBar } from '@/components/layout/TopBar';
import { RevenueChart } from '@/components/charts/RevenueChart';
import { WeeklySalesChart } from '@/components/charts/WeeklySalesChart';
import { SalesByCategoryChart } from '@/components/charts/SalesByCategoryChart';

export default function ReportsPage() {
  return (
    <>
      <TopBar title="Reports" subtitle="Detailed analytics and exports" />
      <div className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-6 py-6 space-y-6">
        <RevenueChart />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklySalesChart />
          <SalesByCategoryChart />
        </div>
      </div>
    </>
  );
}
