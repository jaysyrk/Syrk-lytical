import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  prefix?: string;
  decimal?: boolean;
}

function formatValue(value: number, prefix?: string, decimal?: boolean) {
  const formatted = decimal
    ? value.toFixed(2)
    : value >= 1000
    ? value.toLocaleString()
    : value.toString();
  return prefix ? `${prefix}${formatted}` : formatted;
}

export function MetricCard({ label, value, change, prefix, decimal }: MetricCardProps) {
  const pct = change !== 0 ? Math.abs((change / (value - change)) * 100) : 0;
  const isPositive = change >= 0;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-6 py-5 flex flex-col gap-3">
      <p className="text-sm font-semibold text-neutral-400">{label}</p>
      <p className="text-4xl font-bold text-white tracking-tight">
        {formatValue(value, prefix, decimal)}
      </p>
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${
          isPositive
            ? 'bg-emerald-500/15 text-emerald-400'
            : 'bg-red-500/15 text-red-400'
        }`}
      >
        {isPositive ? '▲' : '▼'} {pct.toFixed(1)}% vs last period
      </span>
    </div>
  );
}

export function MetricsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
      {children}
    </div>
  );
}
