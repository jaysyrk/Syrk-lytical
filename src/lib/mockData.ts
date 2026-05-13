export const kpiData = [
  { label: 'Total Revenue', value: 128450, change: 12400, prefix: '$' },
  { label: 'Total Orders', value: 3842, change: 312 },
  { label: 'Active Customers', value: 1920, change: 88 },
  { label: 'Avg. Order Value', value: 33.43, change: 2.1, prefix: '$', decimal: true },
];

export const revenueData = [
  { month: 'Jan', revenue: 42000, expenses: 28000 },
  { month: 'Feb', revenue: 51000, expenses: 31000 },
  { month: 'Mar', revenue: 47000, expenses: 29500 },
  { month: 'Apr', revenue: 61000, expenses: 34000 },
  { month: 'May', revenue: 55000, expenses: 32000 },
  { month: 'Jun', revenue: 72000, expenses: 38000 },
  { month: 'Jul', revenue: 68000, expenses: 36500 },
  { month: 'Aug', revenue: 79000, expenses: 41000 },
  { month: 'Sep', revenue: 83000, expenses: 43000 },
  { month: 'Oct', revenue: 91000, expenses: 47000 },
  { month: 'Nov', revenue: 105000, expenses: 52000 },
  { month: 'Dec', revenue: 128000, expenses: 61000 },
];

export const salesByCategoryData = [
  { name: 'Electronics', value: 38 },
  { name: 'Clothing', value: 24 },
  { name: 'Food & Drink', value: 18 },
  { name: 'Home & Garden', value: 12 },
  { name: 'Other', value: 8 },
];

export const weeklySalesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 3900 },
  { day: 'Thu', sales: 7100 },
  { day: 'Fri', sales: 9400 },
  { day: 'Sat', sales: 11200 },
  { day: 'Sun', sales: 6700 },
];

export const topProducts = [
  { id: 1, name: 'Wireless Earbuds Pro', category: 'Electronics', sales: 842, revenue: 67360 },
  { id: 2, name: 'Running Shoes X9', category: 'Clothing', sales: 634, revenue: 44380 },
  { id: 3, name: 'Coffee Blend Premium', category: 'Food & Drink', sales: 1205, revenue: 24100 },
  { id: 4, name: 'Smart Watch Series 4', category: 'Electronics', sales: 389, revenue: 93360 },
  { id: 5, name: 'Yoga Mat Elite', category: 'Home & Garden', sales: 510, revenue: 20400 },
];

export const recentOrders = [
  { id: '#ORD-0091', customer: 'Alex Johnson', product: 'Wireless Earbuds Pro', amount: 79.99, status: 'completed', date: '2026-05-12' },
  { id: '#ORD-0090', customer: 'Maria Garcia', product: 'Smart Watch Series 4', amount: 239.99, status: 'processing', date: '2026-05-12' },
  { id: '#ORD-0089', customer: 'James Lee', product: 'Coffee Blend Premium', amount: 19.99, status: 'completed', date: '2026-05-11' },
  { id: '#ORD-0088', customer: 'Sarah Kim', product: 'Running Shoes X9', amount: 69.99, status: 'shipped', date: '2026-05-11' },
  { id: '#ORD-0087', customer: 'Tom Brown', product: 'Yoga Mat Elite', amount: 39.99, status: 'cancelled', date: '2026-05-10' },
  { id: '#ORD-0086', customer: 'Emily Clark', product: 'Wireless Earbuds Pro', amount: 79.99, status: 'completed', date: '2026-05-10' },
];
