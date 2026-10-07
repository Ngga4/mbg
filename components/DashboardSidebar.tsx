'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { LayoutDashboard, UtensilsCrossed, Package } from 'lucide-react';

type NavItem = {
  name: string;
  path: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Menu', path: '/dashboard/menu/create', icon: UtensilsCrossed },
  { name: 'Bahan', path: '/dashboard/bahan', icon: Package },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass-card-premium border-r border-[var(--glass-border)] p-6 flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8">
        <Image
          src="/logo-mbg.png"
          alt="Logo MBG"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <div>
          <h1 className="font-bold">Dashboard MBG</h1>
          <p className="text-xs text-[var(--text-muted)]">Admin Panel</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-white'
                  : 'hover:bg-[var(--glass-bg)] text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="pt-6 border-t border-[var(--glass-border)]">
        <div className="mb-4">
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-[var(--text-muted)]">Administrator</p>
        </div>
        <button
          onClick={signOut}
          className="w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] rounded-lg transition-colors text-left"
        >
          ← Logout
        </button>
      </div>
    </aside>
  );
}
