import { writeFileSync } from 'fs';

const products = [
  { name: 'Wireless Earbuds',  category: 'Electronics',   price: 79.99,  cost: 25.00 },
  { name: 'Smart Watch',       category: 'Electronics',   price: 239.99, cost: 80.00 },
  { name: 'Laptop Stand',      category: 'Electronics',   price: 49.99,  cost: 15.00 },
  { name: 'Phone Case',        category: 'Electronics',   price: 19.99,  cost: 5.00  },
  { name: 'Running Shoes',     category: 'Clothing',      price: 89.99,  cost: 30.00 },
  { name: 'Yoga Pants',        category: 'Clothing',      price: 54.99,  cost: 18.00 },
  { name: 'Hoodie',            category: 'Clothing',      price: 44.99,  cost: 14.00 },
  { name: 'Coffee Blend',      category: 'Food & Drink',  price: 24.99,  cost: 7.00  },
  { name: 'Protein Powder',    category: 'Food & Drink',  price: 49.99,  cost: 15.00 },
  { name: 'Yoga Mat',          category: 'Home & Garden', price: 39.99,  cost: 12.00 },
  { name: 'Desk Lamp',         category: 'Home & Garden', price: 34.99,  cost: 10.00 },
  { name: 'Water Bottle',      category: 'Home & Garden', price: 29.99,  cost: 8.00  },
];

const customers = [
  'Alice Smith','Bob Jones','Carol White','Dave Brown','Eve Davis',
  'Frank Miller','Grace Wilson','Henry Taylor','Isabel Moore','Jack Anderson',
  'Karen Thompson','Leo Martinez','Maria Garcia','Nathan Jackson','Olivia Harris',
  'Peter Clark','Quinn Lewis','Rachel Walker','Sam Robinson','Tara Young',
];

const statuses = [
  'completed','completed','completed','completed','completed',
  'completed','completed','shipped','shipped','processing','cancelled',
];

const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
const jitter = p => Math.round(p * (0.95 + Math.random() * 0.1) * 100) / 100;
const pad = n => String(n).padStart(2, '0');

// Monthly row counts — ramp up to show business growth
const months = [
  { y: 2025, m: 5,  count: 18 },
  { y: 2025, m: 6,  count: 20 },
  { y: 2025, m: 7,  count: 22 },
  { y: 2025, m: 8,  count: 25 },
  { y: 2025, m: 9,  count: 27 },
  { y: 2025, m: 10, count: 29 },
  { y: 2025, m: 11, count: 31 },
  { y: 2025, m: 12, count: 36 },
  { y: 2026, m: 1,  count: 33 },
  { y: 2026, m: 2,  count: 35 },
  { y: 2026, m: 3,  count: 37 },
  { y: 2026, m: 4,  count: 40 },
  { y: 2026, m: 5,  count: 24 }, // partial month
];

const rows = [];
let orderId = 1;

for (const { y, m, count } of months) {
  const daysInMonth = new Date(y, m, 0).getDate();
  for (let i = 0; i < count; i++) {
    const day = 1 + Math.floor(Math.random() * daysInMonth);
    const date = `${y}-${pad(m)}-${pad(day)}`;
    const prod = rnd(products);
    rows.push([
      date,
      `ORD-${String(orderId++).padStart(4, '0')}`,
      rnd(customers),
      prod.name,
      prod.category,
      jitter(prod.price),
      rnd(statuses),
      prod.cost,
    ].join(','));
  }
}

rows.sort();

const header = 'date,order_id,customer,product,category,amount,status,cost';
writeFileSync('public/sample-data.csv', [header, ...rows].join('\n'));
console.log(`Written ${rows.length} rows to public/sample-data.csv`);
