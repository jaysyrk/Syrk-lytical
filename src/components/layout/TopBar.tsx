'use client';

import { useRef, useState, useEffect } from 'react';
import { Bell, Search, Upload, Trash2, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const { isImported, rowCount, clearData } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
      <div>
        <h1 className="text-white font-semibold text-xl">{title}</h1>
        {subtitle && <p className="text-neutral-500 text-sm mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <span className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${
          isImported ? 'bg-emerald-500/15 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isImported ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
          {isImported ? 'Live data' : 'Demo data'}
        </span>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-neutral-900 border border-neutral-800 text-sm text-neutral-300 placeholder-neutral-600 rounded-md pl-9 pr-4 py-1.5 focus:outline-none focus:border-violet-500 w-48"
          />
        </div>

        {/* Notification / data status button */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="relative p-2 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <Bell className="w-4 h-4" />
            {!isImported && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-white text-sm font-semibold">Data status</p>
              </div>

              {isImported ? (
                <>
                  <div className="px-4 py-4 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Live data active</p>
                      <p className="text-neutral-500 text-xs mt-0.5">
                        {rowCount.toLocaleString()} rows loaded from your CSV. All charts and KPIs reflect your data.
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    <Link
                      href="/import"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Import new data
                    </Link>
                    <button
                      onClick={() => { clearData(); setOpen(false); }}
                      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear data &amp; return to demo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-4 flex items-start gap-3">
                    <Info className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-white text-sm font-medium">Showing demo data</p>
                      <p className="text-neutral-500 text-xs mt-0.5">
                        Import a CSV to see your real business analytics.
                      </p>
                    </div>
                  </div>
                  <div className="px-4 pb-4">
                    <Link
                      href="/import"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5" /> Import your data
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">
          J
        </div>
      </div>
    </header>
  );
}
