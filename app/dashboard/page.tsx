'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ClipboardList, Flame, CheckCircle, UtensilsCrossed, Package, Home } from 'lucide-react';
import NutritionChart from '@/components/charts/NutritionChart';

type Menu = {
  id: string;
  nama_menu: string;
  tanggal: string;
  total_kalori: number;
  total_protein: number;
  total_lemak: number;
  total_karbohidrat: number;
  status: 'sesuai' | 'kurang' | 'berlebih';
  created_at: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      // Manual redirect removed to allow logout redirect to homepage
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchMenus();
    }
  }, [user]);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .order('tanggal', { ascending: false })
      .limit(10);

    if (!error && data) {
      setMenus(data);
    }
    setLoadingMenus(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const avgKalori = menus.length > 0 
    ? menus.reduce((sum, m) => sum + (m.total_kalori || 0), 0) / menus.length 
    : 0;

  return (
    <main className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-[var(--text-muted)] mt-1">
          Dashboard monitoring menu gizi MBG
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card-premium p-6 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Total Menu</p>
              <p className="text-4xl font-bold mt-2">{menus.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <ClipboardList className="text-blue-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Menu terdaftar bulan ini
          </p>
        </div>

        <div className="glass-card-premium p-6 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Rata-rata Kalori</p>
              <p className="text-4xl font-bold mt-2">{avgKalori.toFixed(0)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <Flame className="text-orange-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            kkal per menu
          </p>
        </div>

        <div className="glass-card-premium p-6 rounded-2xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Status Sesuai</p>
              <p className="text-4xl font-bold mt-2 text-[var(--status-success)]">
                {Math.round((menus.filter(m => m.status === 'sesuai').length / (menus.length || 1)) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-400" size={24} />
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            {menus.filter(m => m.status === 'sesuai').length} dari {menus.length} menu
          </p>
        </div>
      </div>

      {/* Recent Activity & Chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card-premium p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Trend Kalori Harian</h2>
          <p className="text-xs text-[var(--text-muted)] mb-4">
            Grafik kandungan kalori menu berdasarkan tanggal
          </p>
          <NutritionChart
            data={menus.map(m => ({
              tanggal: new Date(m.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
              kalori: m.total_kalori || 0,
              protein: m.total_protein || 0,
              lemak: m.total_lemak || 0,
              karbohidrat: m.total_karbohidrat || 0,
            })).reverse()}
            dataKey="kalori"
            color="#3b82f6"
            label="Kalori (kkal)"
          />
        </div>

        <div className="glass-card-premium p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Menu Terbaru</h2>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {menus.slice(0, 4).map((menu) => (
              <div
                key={menu.id}
                onClick={() => router.push(`/dashboard/menu/${menu.id}`)}
                className="p-3 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)]/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{menu.nama_menu}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {new Date(menu.tanggal).toLocaleDateString('id-ID')} • {menu.total_kalori?.toFixed(0)} kkal
                    </p>
                  </div>
                  <Badge
                    variant={
                      menu.status === 'sesuai'
                        ? 'success'
                        : menu.status === 'kurang'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {menu.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
