# Syrk-lytical

Business analytics for any company. Import a CSV export from your existing system and instantly see revenue trends, sales breakdowns, top products, and customer data � all in your browser with no server, no account, and no data leaving your machine.

---

## Connecting Your Business Data

Syrk-lytical works with any CSV export. You need at least two columns: a **date** and an **amount**. Everything else (customer, product, category, status, cost) is optional but unlocks more charts and tables.

### Exporting from common platforms

**Shopify**
1. Admin ? Orders ? Export ? All orders ? CSV
2. Map: `Created at` ? Date, `Total` ? Amount, `Name` ? Order ID, `Email` ? Customer, `Lineitem name` ? Product

**Square**
1. Dashboard ? Reports ? Sales Summary ? Export
2. Map: `Date` ? Date, `Gross Sales` ? Amount, `Transaction ID` ? Order ID, `Customer Name` ? Customer, `Item` ? Product, `Category` ? Category

**Stripe**
1. Dashboard ? Payments ? Export ? CSV
2. Map: `Created (UTC)` ? Date, `Amount` ? Amount, `id` ? Order ID, `Customer Email` ? Customer

**WooCommerce**
1. WP Admin ? WooCommerce ? Orders ? Export (or use the Store Exporter plugin)
2. Map: `Order Date` ? Date, `Order Total` ? Amount, `Order ID` ? Order ID, `Billing Email` ? Customer

**QuickBooks**
1. Reports ? Sales by Customer Detail ? Export to Excel/CSV
2. Map: `Date` ? Date, `Amount` ? Amount, `Num` ? Order ID, `Customer` ? Customer, `Product/Service` ? Product

**Excel / Google Sheets**
Export any sales table as CSV (File ? Download ? CSV). As long as you have a date column and a revenue/amount column, it will work.

---

## CSV Format Reference

```
date,order_id,customer,product,category,amount,status,cost
2026-05-01,ORD-0001,Alice Smith,Wireless Earbuds,Electronics,79.99,completed,25.00
```

| Column     | Required | Description                           | Accepted formats                     |
|------------|----------|---------------------------------------|--------------------------------------|
| `date`     | Yes      | Transaction or order date             | YYYY-MM-DD, MM/DD/YYYY, DD/MM/YYYY   |
| `amount`   | Yes      | Revenue or payment amount             | 79.99, $79.99, �79.99                |
| `order_id` | No       | Unique order or transaction reference | Any string                           |
| `customer` | No       | Customer name or identifier           | Any string                           |
| `product`  | No       | Product or service name               | Any string                           |
| `category` | No       | Product category or department        | Any string                           |
| `status`   | No       | Order status                          | completed, shipped, processing, etc  |
| `cost`     | No       | Cost of goods / expense amount        | Same as amount                       |

Column names do not have to match exactly � the importer auto-detects common variations (e.g. `Total`, `Sale Amount`, `Invoice Date`, `Transaction Date`). You can manually remap any column during the import step.

---

## Running Locally

```bash
git clone https://github.com/jaysyrk/Syrk-lytical.git
cd Syrk-lytical
npm install
npm run dev
```

Open http://localhost:3000.

---

## Privacy

All data is processed and stored locally in your browser (localStorage). Nothing is uploaded to any server. Closing the tab or clicking Clear data in the notification panel removes everything.

---

## Tech Stack

- Next.js 15 (App Router)
- Tailwind CSS v4
- Recharts
- PapaParse for CSV parsing
- Lucide React for icons
