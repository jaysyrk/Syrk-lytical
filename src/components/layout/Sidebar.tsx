'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  BarChart2,
  Settings,
  Zap,
  Upload,
} from 'lucide-react';
import { useData } from '@/context/DataContext';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
  { href: '/import', label: 'Import Data', icon: Upload },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isImported, rowCount } = useData();

  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen bg-neutral-950 border-r border-neutral-800 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-neutral-800">
        <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Syrk-lytical</span>
        {isImported && (
          <span className="ml-auto text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">Live</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-violet-600/20 text-violet-400'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {href === '/import' && !isImported && (
                <span className="ml-auto text-[10px] font-semibold bg-violet-600/20 text-violet-400 px-1.5 py-0.5 rounded-full">Setup</span>
              )}
              {href === '/import' && isImported && (
                <span className="ml-auto text-[10px] text-neutral-600">{rowCount.toLocaleString()} rows</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-xs text-white font-bold">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">Jake</p>
            <p className="text-xs text-neutral-500 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
