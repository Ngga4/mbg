'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calculateNutrition } from '@/lib/calculations';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

type Bahan = {
  id: string;
  nama: string;
  kalori_per_100g: number;
  protein_per_100g: number;
  lemak_per_100g: number;
  karbohidrat_per_100g: number;
};

type MenuDetail = {
  bahan: Bahan | null;
  porsi_gram: number;
  metode_masak: string;
};

type Standar = {
  kategori: string;
  nilai_min: number;
  nilai_max: number;
};

export default function CreateMenuPage() {
  const router = useRouter();
  const [namaMenu, setNamaMenu] = useState('');
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [bahanList, setBahanList] = useState<Bahan[]>([]);
  const [standarGizi, setStandarGizi] = useState<Standar[]>([]);
  const [menuDetails, setMenuDetails] = useState<MenuDetail[]>([
    { bahan: null, porsi_gram: 0, metode_masak: 'kukus' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBahan();
    fetchStandar();
  }, []);

  const fetchBahan = async () => {
    const res = await fetch('/api/bahan');
    const data = await res.json();
    setBahanList(data);
  };

  const fetchStandar = async () => {
    const res = await fetch('/api/standar');
    const data = await res.json();
    setStandarGizi(data);
  };

  const addBahan = () => {
    setMenuDetails([
      ...menuDetails,
      { bahan: null, porsi_gram: 0, metode_masak: 'kukus' },
    ]);
  };

  const removeBahan = (index: number) => {
    const updated = menuDetails.filter((_, i) => i !== index);
    setMenuDetails(updated);
  };

  const updateDetail = (
    index: number,
    field: keyof MenuDetail,
    value: any
  ) => {
    const updated = [...menuDetails];
    if (field === 'bahan') {
      const bahan = bahanList.find((b) => b.id === value);
      updated[index].bahan = bahan || null;
    } else {
      updated[index][field] = value as never;
    }
    setMenuDetails(updated);
  };

  const validDetails = menuDetails.filter(
    (d) => d.bahan && d.porsi_gram > 0
  );
  const nutrition =
    validDetails.length > 0 && standarGizi.length > 0
      ? calculateNutrition(
          validDetails as (MenuDetail & { bahan: Bahan })[],
          standarGizi
        )
      : null;

  const handleSave = async () => {
    if (!namaMenu || validDetails.length === 0) {
      setError('Nama menu dan bahan harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Login dulu');
        return;
      }

      // Insert menu
      const { data: menu, error: menuError } = await supabase
        .from('menu')
        .insert({
          nama_menu: namaMenu,
          tanggal,
          created_by: user.id,
          total_kalori: nutrition?.kalori,
          total_protein: nutrition?.protein,
          total_lemak: nutrition?.lemak,
          total_karbohidrat: nutrition?.karbohidrat,
          status: nutrition?.status,
        })
        .select()
        .single();

      if (menuError) throw menuError;

      // Insert menu details
      const detailInserts = validDetails.map((d) => ({
        menu_id: menu.id,
        bahan_id: d.bahan!.id,
        porsi_gram: d.porsi_gram,
        metode_masak: d.metode_masak,
      }));

      const { error: detailError } = await supabase
        .from('menu_detail')
        .insert(detailInserts);

      if (detailError) throw detailError;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Gagal simpan menu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Buat Menu Baru</h1>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Kembali
          </Button>
        </div>

        <GlassCard className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nama Menu"
              placeholder="Contoh: Menu Senin"
              value={namaMenu}
              onChange={(e) => setNamaMenu(e.target.value)}
            />
            <Input
              type="date"
              label="Tanggal"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bahan Makanan</h2>
              <Button variant="primary" onClick={addBahan}>
                + Tambah Bahan
              </Button>
            </div>

            {menuDetails.map((detail, index) => (
              <GlassCard key={index} className="p-4">
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium mb-2">
                      Bahan
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm"
                      value={detail.bahan?.id || ''}
                      onChange={(e) =>
                        updateDetail(index, 'bahan', e.target.value)
                      }
                    >
                      <option value="">Pilih bahan</option>
                      {bahanList.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Porsi (gram)
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm"
                      value={detail.porsi_gram || ''}
                      onChange={(e) =>
                        updateDetail(
                          index,
                          'porsi_gram',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium mb-2">
                      Metode Masak
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg text-sm"
                      value={detail.metode_masak}
                      onChange={(e) =>
                        updateDetail(index, 'metode_masak', e.target.value)
                      }
                    >
                      <option value="kukus">Kukus</option>
                      <option value="rebus">Rebus</option>
                      <option value="goreng">Goreng</option>
                      <option value="panggang">Panggang</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <Button
                      variant="ghost"
                      onClick={() => removeBahan(index)}
                      disabled={menuDetails.length === 1}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </GlassCard>

        {nutrition && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hasil Analisis Gizi</h2>
              <Badge variant={nutrition.status === 'sesuai' ? 'success' : nutrition.status === 'kurang' ? 'error' : 'warning'}>
                {nutrition.status.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-[var(--text-muted)]">Kalori</p>
                <p className="text-2xl font-bold">{nutrition.kalori.toFixed(1)}</p>
                <p className="text-xs text-[var(--text-muted)]">kkal</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Protein</p>
                <p className="text-2xl font-bold">{nutrition.protein.toFixed(1)}</p>
                <p className="text-xs text-[var(--text-muted)]">gram</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Lemak</p>
                <p className="text-2xl font-bold">{nutrition.lemak.toFixed(1)}</p>
                <p className="text-xs text-[var(--text-muted)]">gram</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Karbohidrat</p>
                <p className="text-2xl font-bold">{nutrition.karbohidrat.toFixed(1)}</p>
                <p className="text-xs text-[var(--text-muted)]">gram</p>
              </div>
            </div>

            <div className="space-y-2">
              {nutrition.details.map((d) => (
                <div
                  key={d.kategori}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="capitalize">{d.kategori}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">
                      {d.min} - {d.max}
                    </span>
                    <Badge variant={d.status === 'sesuai' ? 'success' : d.status === 'kurang' ? 'error' : 'warning'}>
                      {d.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {error && (
          <p className="text-sm text-[var(--status-error)]">{error}</p>
        )}

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={loading || !nutrition}
            fullWidth
          >
            {loading ? 'Menyimpan...' : 'Simpan Menu'}
          </Button>
        </div>
      </div>
    </main>
  );
}
