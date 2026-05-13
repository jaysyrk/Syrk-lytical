export interface DataRow {
  date: string;       // ISO date "YYYY-MM-DD"
  amount: number;     // revenue / payment amount
  orderId: string;
  customer: string;
  product: string;
  category: string;
  status: string;
  cost: number;       // 0 if not mapped
}

export type FieldKey = 'date' | 'amount' | 'orderId' | 'customer' | 'product' | 'category' | 'status' | 'cost';

export interface ColumnMapping {
  date: string;
  amount: string;
  orderId?: string;
  customer?: string;
  product?: string;
  category?: string;
  status?: string;
  cost?: string;
}

export interface KpiItem {
  label: string;
  value: number;
  change: number;
  prefix?: string;
  decimal?: boolean;
}

export interface AnalyticsData {
  kpis: KpiItem[];
  revenueData: { month: string; revenue: number; expenses: number }[];
  salesByCategoryData: { name: string; value: number }[];
  weeklySalesData: { day: string; sales: number }[];
  topProducts: { id: number; name: string; category: string; sales: number; revenue: number }[];
  recentOrders: { id: string; customer: string; product: string; amount: number; status: string; date: string }[];
}
