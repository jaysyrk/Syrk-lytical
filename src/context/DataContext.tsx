'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { DataRow, AnalyticsData } from '@/lib/dataTypes';
import { computeAnalytics } from '@/lib/analytics';

const STORAGE_KEY = 'syrklytical_rows_v1';

interface DataContextValue {
  rows: DataRow[];
  setRows: (rows: DataRow[]) => void;
  clearData: () => void;
  isImported: boolean;
  analytics: AnalyticsData;
  rowCount: number;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [rows, setRowsState] = useState<DataRow[]>([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setRowsState(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const setRows = (newRows: DataRow[]) => {
    setRowsState(newRows);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newRows)); } catch { /* ignore */ }
  };

  const clearData = () => {
    setRowsState([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  };

  const analytics = useMemo(() => computeAnalytics(rows), [rows]);

  return (
    <DataContext.Provider value={{
      rows,
      setRows,
      clearData,
      isImported: rows.length > 0,
      analytics,
      rowCount: rows.length,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside <DataProvider>');
  return ctx;
}
