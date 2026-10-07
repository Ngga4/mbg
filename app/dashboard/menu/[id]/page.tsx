import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DeleteMenuButton from '@/components/DeleteMenuButton';

type Bahan = {
  id: string;
  nama: string;
  kalori_per_100g: number;
  protein_per_100g: number;
  lemak_per_100g: number;
  karbohidrat_per_100g: number;
};

type MenuDetail = {
  id: string;
  porsi_gram: number;
  metode_masak: string;
  bahan: Bahan;
};

type Menu = {
  id: string;
  nama_menu: string;
  tanggal: string;
  total_kalori: number;
  total_protein: number;
  total_lemak: number;
  total_karbohidrat: number;
  status: string;
};

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch menu
  const { data: menu, error: menuError } = await supabase
    .from('menu')
    .select('*')
    .eq('id', id)
    .single();

  if (menuError || !menu) {
    notFound();
  }

  // Fetch menu details with bahan
  const { data: details } = await supabase
    .from('menu_detail')
    .select(`
      *,
      bahan:bahan_makanan(*)
    `)
    .eq('menu_id', id);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{menu.nama_menu}</h1>
          <div className="flex gap-2">
            <Link href={`/dashboard/menu/${menu.id}/edit`}>
              <Button variant="secondary">Edit Menu</Button>
            </Link>
            <DeleteMenuButton menuId={menu.id} />
            <Link href="/dashboard">
              <Button variant="ghost">Kembali</Button>
            </Link>
          </div>
        </div>

        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Tanggal</p>
              <p className="font-semibold">
                {new Date(menu.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
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
              {menu.status.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[var(--text-muted)]">Kalori</p>
              <p className="text-2xl font-bold">{menu.total_kalori?.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)]">kkal</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Protein</p>
              <p className="text-2xl font-bold">{menu.total_protein?.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)]">gram</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Lemak</p>
              <p className="text-2xl font-bold">{menu.total_lemak?.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)]">gram</p>
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">Karbohidrat</p>
              <p className="text-2xl font-bold">{menu.total_karbohidrat?.toFixed(1)}</p>
              <p className="text-xs text-[var(--text-muted)]">gram</p>
            </div>
          </div>
        </GlassCard>

        {details && details.length > 0 && (
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Komposisi Bahan</h2>
            <div className="space-y-3">
              {details.map((detail: any) => (
                <GlassCard key={detail.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{detail.bahan.nama}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {detail.porsi_gram}g • {detail.metode_masak}
                      </p>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <p className="text-[var(--text-muted)]">Kalori</p>
                        <p className="font-semibold">
                          {((detail.bahan.kalori_per_100g * detail.porsi_gram) / 100).toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">Protein</p>
                        <p className="font-semibold">
                          {((detail.bahan.protein_per_100g * detail.porsi_gram) / 100).toFixed(1)}g
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">Lemak</p>
                        <p className="font-semibold">
                          {((detail.bahan.lemak_per_100g * detail.porsi_gram) / 100).toFixed(1)}g
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--text-muted)]">Karbo</p>
                        <p className="font-semibold">
                          {((detail.bahan.karbohidrat_per_100g * detail.porsi_gram) / 100).toFixed(1)}g
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </main>
  );
}
