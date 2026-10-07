import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase-server';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ScrollAnimations from '@/components/ScrollAnimations';
import NutritionChecker from '@/components/NutritionChecker';

type Menu = {
  id: string;
  nama_menu: string;
  tanggal: string;
  total_kalori: number;
  total_protein: number;
  total_lemak: number;
  total_karbohidrat: number;
  status: 'sesuai' | 'kurang' | 'berlebih';
};

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch menu for current week
  const { data: menus } = await supabase
    .from('menu')
    .select('*')
    .order('tanggal', { ascending: true })
    .limit(7);

  const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  return (
    <main className="min-h-screen relative overflow-hidden">
      <ScrollAnimations />
      
      {/* Gradient blur orbs - Blue theme */}
      <div className="gradient-orb gradient-orb-hero"></div>
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo-mbg.png" 
              alt="Logo MBG" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <div>
              <h1 className="font-bold text-lg leading-tight">Dashboard MBG</h1>
              <p className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">Badan Gizi Nasional</p>
            </div>
          </div>

          <Link href="/login">
            <Button variant="primary">Login</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div className="space-y-6 fade-in-up">
              <div>
                <p className="text-sm text-[var(--text-muted)] mb-2">Makanan Bergizi Gratis</p>
                <h2 className="text-5xl font-bold leading-tight text-gradient-premium">
                  Menu Gizi Sekolah
                </h2>
              </div>
              <p className="text-lg text-[var(--text-secondary)]">
                Pantau kandungan gizi menu harian untuk anak sekolah. 
                Informasi lengkap kalori, protein, lemak, dan karbohidrat.
              </p>
              <div className="flex gap-4">
                <Link href="#menu">
                  <Button variant="primary">Lihat Menu Minggu Ini</Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 fade-in-up" style={{ transitionDelay: '0.2s' }}>
              <div className="glass-card-premium p-6 rounded-2xl">
                <p className="text-sm text-[var(--text-muted)]">Total Menu</p>
                <p className="text-4xl font-bold mt-2">{menus?.length || 0}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">Menu tersedia</p>
              </div>
              <div className="glass-card-premium p-6 rounded-2xl">
                <p className="text-sm text-[var(--text-muted)]">Standar Kalori</p>
                <p className="text-4xl font-bold mt-2">600-750</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">kkal per porsi</p>
              </div>
              <div className="glass-card-premium p-6 rounded-2xl col-span-2">
                <p className="text-sm text-[var(--text-muted)]">Menu Sesuai Standar</p>
                <p className="text-4xl font-bold mt-2 text-[var(--status-success)]">
                  {menus?.filter(m => m.status === 'sesuai').length || 0}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  dari {menus?.length || 0} menu
                </p>
              </div>
            </div>
          </div>
          
          {/* Nutrition Checker Section */}
          <div id="cek-gizi" className="mt-16 fade-in-up" style={{ transitionDelay: '0.4s' }}>
            <h2 className="text-3xl font-bold mb-8 text-center">Cek Gizi Mandiri</h2>
            <NutritionChecker />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 fade-in-up">
            <h2 className="text-3xl font-bold">Menu Minggu Ini</h2>
            <p className="text-[var(--text-muted)] mt-2">
              Informasi gizi lengkap untuk setiap hari
            </p>
          </div>

          {menus && menus.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.map((menu, index) => {
                const date = new Date(menu.tanggal);
                const dayName = daysOfWeek[date.getDay()];
                
                return (
                  <div 
                    key={menu.id} 
                    className="glass-card-premium p-6 rounded-2xl space-y-4 fade-in-up"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-[var(--text-muted)]">{dayName}</p>
                        <h3 className="text-xl font-bold mt-1">{menu.nama_menu}</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                          {date.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
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

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[var(--glass-border)]">
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Kalori</p>
                        <p className="text-lg font-bold">{menu.total_kalori?.toFixed(0)}</p>
                        <p className="text-xs text-[var(--text-muted)]">kkal</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Protein</p>
                        <p className="text-lg font-bold">{menu.total_protein?.toFixed(0)}</p>
                        <p className="text-xs text-[var(--text-muted)]">gram</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Lemak</p>
                        <p className="text-lg font-bold">{menu.total_lemak?.toFixed(0)}</p>
                        <p className="text-xs text-[var(--text-muted)]">gram</p>
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">Karbohidrat</p>
                        <p className="text-lg font-bold">{menu.total_karbohidrat?.toFixed(0)}</p>
                        <p className="text-xs text-[var(--text-muted)]">gram</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <GlassCard className="p-12 text-center">
              <p className="text-[var(--text-muted)]">
                Belum ada menu tersedia untuk minggu ini.
              </p>
            </GlassCard>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto text-center text-sm text-[var(--text-muted)]">
          <p>Dashboard MBG © 2026 - Informasi Gizi Makanan Bergizi Gratis</p>
        </div>
      </footer>
    </main>
  );
}
