import type { DataRow, AnalyticsData } from './dataTypes';
import {
  kpiData,
  revenueData as mockRevenue,
  salesByCategoryData as mockCategory,
  weeklySalesData as mockWeekly,
  topProducts as mockTopProducts,
  recentOrders as mockRecentOrders,
} from './mockData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getMockAnalytics(): AnalyticsData {
  return {
    kpis: kpiData,
    revenueData: mockRevenue,
    salesByCategoryData: mockCategory,
    weeklySalesData: mockWeekly,
    topProducts: mockTopProducts,
    recentOrders: mockRecentOrders,
  };
}

export function computeAnalytics(rows: DataRow[]): AnalyticsData {
  if (rows.length === 0) return getMockAnalytics();

  // Use the most recent date in the data as the reference point so that
  // historical CSVs don't produce all-zero KPIs.
  const latestDate = rows.reduce((max, r) => {
    const d = new Date(r.date);
    return d > max ? d : max;
  }, new Date(0));

  const currMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
  const prevMonthStart = new Date(latestDate.getFullYear(), latestDate.getMonth() - 1, 1);

  const currRows = rows.filter(r => new Date(r.date) >= currMonthStart);
  const prevRows = rows.filter(r => {
    const d = new Date(r.date);
    return d >= prevMonthStart && d < currMonthStart;
  });

  const sum = (rs: DataRow[]) => rs.reduce((s, r) => s + r.amount, 0);
  const uniq = (rs: DataRow[], k: keyof DataRow) =>
    new Set(rs.map(r => r[k]).filter(Boolean)).size || rs.length;

  const currRev = sum(currRows);
  const prevRev = sum(prevRows);
  const currOrders = currRows.length;
  const prevOrders = prevRows.length;
  const currCust = uniq(currRows, 'customer');
  const prevCust = uniq(prevRows, 'customer');
  const currAov = currOrders > 0 ? currRev / currOrders : 0;
  const prevAov = prevOrders > 0 ? prevRev / prevOrders : 0;

  // ── KPIs (current month value + MoM change) ─────────────────────────────
  // MetricCard formula: pct = change / (value - change) = (curr-prev)/prev = exact MoM %
  const kpis = [
    { label: 'Revenue (Month)', value: r2(currRev), change: r2(currRev - prevRev), prefix: '$' },
    { label: 'Orders (Month)', value: currOrders, change: currOrders - prevOrders },
    { label: 'Customers (Month)', value: currCust, change: currCust - prevCust },
    { label: 'Avg. Order Value', value: r2(currAov), change: r2(currAov - prevAov), prefix: '$', decimal: true },
  ];

  // ── Revenue by month ─────────────────────────────────────────────────────
  const monthMap = new Map<string, { revenue: number; cost: number }>();
  rows.forEach(r => {
    const key = MONTHS[new Date(r.date).getMonth()];
    const cur = monthMap.get(key) ?? { revenue: 0, cost: 0 };
    monthMap.set(key, { revenue: cur.revenue + r.amount, cost: cur.cost + r.cost });
  });
  const revenueData = MONTHS.filter(m => monthMap.has(m)).map(month => {
    const { revenue, cost } = monthMap.get(month)!;
    return { month, revenue: Math.round(revenue), expenses: Math.round(cost > 0 ? cost : revenue * 0.65) };
  });

  // ── Sales by category ────────────────────────────────────────────────────
  const catMap = new Map<string, number>();
  rows.forEach(r => {
    const cat = r.category || 'Other';
    catMap.set(cat, (catMap.get(cat) ?? 0) + r.amount);
  });
  const catTotal = Array.from(catMap.values()).reduce((s, v) => s + v, 0);
  const salesByCategoryData = Array.from(catMap.entries())
    .map(([name, val]) => ({ name, value: Math.round((val / catTotal) * 100) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // ── Weekly sales (last 7 days relative to the latest date in data) ────────
  const weekStart = new Date(latestDate);
  weekStart.setDate(weekStart.getDate() - 6);
  weekStart.setHours(0, 0, 0, 0);
  const dayRevMap = new Map<number, number>();
  rows.filter(r => new Date(r.date) >= weekStart).forEach(r => {
    const dow = new Date(r.date).getDay();
    dayRevMap.set(dow, (dayRevMap.get(dow) ?? 0) + r.amount);
  });
  const weeklySalesData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(latestDate);
    d.setDate(d.getDate() - (6 - i));
    return { day: DAYS[d.getDay()], sales: Math.round(dayRevMap.get(d.getDay()) ?? 0) };
  });

  // ── Top products ──────────────────────────────────────────────────────────
  const prodMap = new Map<string, { category: string; count: number; revenue: number }>();
  rows.forEach(r => {
    const name = r.product || 'Unknown Product';
    const cur = prodMap.get(name) ?? { category: r.category || 'Other', count: 0, revenue: 0 };
    prodMap.set(name, { category: r.category || cur.category, count: cur.count + 1, revenue: cur.revenue + r.amount });
  });
  const topProducts = Array.from(prodMap.entries())
    .map(([name, { category, count, revenue }], id) => ({ id: id + 1, name, category, sales: count, revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // ── Recent orders ─────────────────────────────────────────────────────────
  const recentOrders = [...rows]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)
    .map((r, i) => ({
      id: r.orderId || `#ORD-${String(rows.length - i).padStart(4, '0')}`,
      customer: r.customer || 'Unknown',
      product: r.product || 'Unknown',
      amount: r.amount,
      status: r.status || 'completed',
      date: r.date,
    }));

  return { kpis, revenueData, salesByCategoryData, weeklySalesData, topProducts, recentOrders };
}

function r2(n: number) {
  return Math.round(n * 100) / 100;
}
